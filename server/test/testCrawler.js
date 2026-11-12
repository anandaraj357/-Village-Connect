import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { seedDatabase } from '../seed/seedSources.js';
import CrawlerSource from '../models/CrawlerSource.js';
import CrawledRecord from '../models/CrawledRecord.js';
import ContentApproval from '../models/ContentApproval.js';
import JobVacancy from '../models/JobVacancy.js';
import RecruitmentNotification from '../models/RecruitmentNotification.js';
import NewsArticle from '../models/NewsArticle.js';
import { executeCrawl } from '../crawler/core/crawlerEngine.js';
import { validateTargetUrl, sanitizeExtractedHtml, stripToPlainText } from '../crawler/core/security.js';
import { generateContentHash, detectDuplicateOrRevision } from '../crawler/core/duplicateDetector.js';
import { processContentWithAI } from '../crawler/ai/geminiProcessor.js';
import { extractRecruitmentDetailsFromText } from '../crawler/core/pdfExtractor.js';
import { publishRecord } from '../services/approvalService.js';
import { getSchedulerMetrics, initializeScheduler } from '../scheduler/crawlerScheduler.js';

dotenv.config();

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

async function runTests() {
  console.log('=================================================================');
  console.log('🧪 RUNNING COMPREHENSIVE OUR VILLAGE CRAWLER TEST SUITE');
  console.log('=================================================================\n');

  try {
    await connectDB();
    await seedDatabase();

    try {
      await initializeScheduler();
    } catch (e) {
      console.log('Scheduler notice: already initialized or standalone');
    }

    // TEST 1: Security & SSRF Protection
    console.log('--- TEST 1: SSRF Protection & URL Sanitization ---');
    let blockedLocal = false;
    try {
      await validateTargetUrl('http://127.0.0.1:8080/admin');
    } catch (err) {
      blockedLocal = err.message.includes('SSRF Protection');
    }
    assert(blockedLocal, 'SSRF correctly blocked loopback 127.0.0.1');

    let blockedMetadata = false;
    try {
      await validateTargetUrl('http://169.254.169.254/latest/meta-data');
    } catch (err) {
      blockedMetadata = err.message.includes('SSRF Protection');
    }
    assert(blockedMetadata, 'SSRF correctly blocked cloud metadata IP (169.254.169.254)');

    const validUrl = await validateTargetUrl('https://psc.ap.gov.in/notifications');
    assert(validUrl.startsWith('https://psc.ap.gov.in'), 'Permitted public HTTPS URL passed validation');

    const cleanHtml = stripToPlainText('<h1>Official Notice</h1><p>Important <script>alert(1)</script>update</p>');
    assert(cleanHtml === 'Official Notice Important update', `HTML sanitizer completely removed scripts. Output: "${cleanHtml}"`);

    // TEST 2: Duplicate Detection & Hashing
    console.log('\n--- TEST 2: Duplicate Detection & Content Hashing ---');
    const hash1 = generateContentHash('Junior Assistant Recruitment 2026', 'Guntur Collectorate', 'NOTIF-01');
    const hash2 = generateContentHash('junior assistant recruitment 2026', 'guntur collectorate', 'notif-01');
    assert(hash1 === hash2, 'Normalized content hashing produces identical hash regardless of casing/spacing');

    const dupCheck = await detectDuplicateOrRevision(
      { title: 'Brand New Unique Job Post ' + Date.now(), organization: 'AP State Board', sourceUrl: 'https://unique.ap.gov.in/job/' + Date.now() },
      'job',
      new mongoose.Types.ObjectId(),
      'AP Board'
    );
    assert(dupCheck.isDuplicate === false, 'Brand new record marked as non-duplicate');

    // TEST 3: PDF Regex Structured Extraction
    console.log('\n--- TEST 3: PDF Structured Extraction ---');
    const samplePdfText = `
      ANDHRA PRADESH PUBLIC SERVICE COMMISSION: VIJAYAWADA
      NOTIFICATION NO. 05/2026.
      Total Number of Vacancies: 245
      Educational Qualification: Must hold a Bachelor Degree of any recognized University.
      Age Limit: 18 to 42 Years as on 01/07/2026.
      Application Fee: Rs. 250 processing fee.
      Selection Process: Computer Based Screening Test and Main Written Exam.
      Last Date for submission: 30/08/2026.
    `;
    const parsedPdf = extractRecruitmentDetailsFromText(samplePdfText);
    assert(parsedPdf.notificationNumber === '05/2026', `Extracted notification number: ${parsedPdf.notificationNumber}`);
    assert(parsedPdf.totalVacancies === 245, `Extracted total vacancies: ${parsedPdf.totalVacancies}`);
    assert(parsedPdf.confidenceScore >= 80, `High confidence score: ${parsedPdf.confidenceScore}%`);
    assert(parsedPdf.missingFields.length === 0, `No critical fields missing. Missing: ${parsedPdf.missingFields.join(', ')}`);

    // TEST 4: AI Summarization & Content Processing
    console.log('\n--- TEST 4: AI Summarization & Content Processing ---');
    const aiItem = {
      title: 'Subsidized Solar Water Pumping Scheme for Small and Marginal Farmers',
      rawContent: 'Andhra Pradesh Renewable Energy Development Corporation invites applications for 5HP solar pump sets with 70% state subsidy for farmers in Guntur and Prakasam districts.',
      recordType: 'news'
    };
    const processedAI = await processContentWithAI(aiItem, { sourceName: 'AP Agriculture Board', recordType: 'news' });
    assert(processedAI.summaryEnglish && processedAI.summaryEnglish.length > 20, 'Generated concise English summary');
    assert(processedAI.summaryTelugu && processedAI.summaryTelugu.length > 20, 'Generated Telugu translated summary');
    assert(processedAI.categoryIdentified === 'Agriculture' || processedAI.categoryIdentified === 'Government Schemes', `Accurate category classified: ${processedAI.categoryIdentified}`);
    assert(processedAI.confidenceScore > 75, `Confidence score calculated: ${processedAI.confidenceScore}%`);

    // TEST 5: Actual Crawler Engine Execution on Configured Source
    console.log('\n--- TEST 5: Real Crawler Engine Execution on Configured Source ---');
    const appscSource = await CrawlerSource.findOne({ adapterKey: 'appsc_recruitment' });
    assert(!!appscSource, `Found APPSC Crawler Source (${appscSource?.name})`);

    const crawlResult = await executeCrawl(appscSource._id, 'manual');
    assert(crawlResult.success === true, 'Crawl execution completed successfully');
    assert(crawlResult.recordsFound > 0, `Extracted ${crawlResult.recordsFound} records`);
    assert(crawlResult.recordsNew >= 0, `Processed ${crawlResult.recordsNew} new records`);

    // TEST 6: Admin Approval & Publishing Workflow
    console.log('\n--- TEST 6: Admin Approval and Publishing to Public Experience ---');
    const pendingApproval = await ContentApproval.findOne({ status: 'pending' }).populate('recordId');
    assert(!!pendingApproval, `Found pending approval item: "${pendingApproval?.title}"`);

    const publishResult = await publishRecord(pendingApproval._id);
    assert(publishResult.success === true, 'Successfully approved and published record');
    assert(!!publishResult.publishedDocument, 'Created published document in public collection');

    // Verify published item in target public collection
    let foundInPublic = false;
    if (publishResult.collection === 'RecruitmentNotifications') {
      const rec = await RecruitmentNotification.findById(publishResult.publishedDocument._id);
      foundInPublic = !!rec;
    } else if (publishResult.collection === 'JobVacancies') {
      const job = await JobVacancy.findById(publishResult.publishedDocument._id);
      foundInPublic = !!job;
    } else {
      const news = await NewsArticle.findById(publishResult.publishedDocument._id);
      foundInPublic = !!news;
    }
    assert(foundInPublic, `Verified record exists in public ${publishResult.collection} collection`);

    // TEST 7: BullMQ Scheduler Metrics
    console.log('\n--- TEST 7: BullMQ & Redis Scheduler Integration ---');
    const schedulerMetrics = await getSchedulerMetrics();
    assert(schedulerMetrics.status === 'active', 'BullMQ queue is active and connected to Redis');
    console.log(`  ℹ️ Repeatable Scheduled Jobs: ${schedulerMetrics.repeatableCount}`);

    console.log('\n=================================================================');
    console.log(`📊 TEST SUITE SUMMARY: ${passedTests}/${totalTests} TESTS PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
    console.log('=================================================================\n');

    process.exit(passedTests === totalTests ? 0 : 1);
  } catch (err) {
    console.error('Fatal Test Error:', err);
    process.exit(1);
  }
}

runTests();
