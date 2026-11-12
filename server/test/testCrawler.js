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
  console.log('🧪 RUNNING COMPREHENSIVE OUR VILLAGE CRAWLER TEST SUITE (TAMIL NADU / NESAL)');
  console.log('=================================================================\n');

  try {
    await connectDB();
    await seedDatabase(false);

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

    const validUrl = await validateTargetUrl('https://www.tnpsc.gov.in/notifications');
    assert(validUrl.startsWith('https://www.tnpsc.gov.in'), 'Permitted public HTTPS URL passed validation');

    const cleanHtml = stripToPlainText('<h1>Official Notice</h1><p>Important <script>alert(1)</script>update</p>');
    assert(cleanHtml === 'Official Notice Important update', `HTML sanitizer completely removed scripts. Output: "${cleanHtml}"`);

    // TEST 2: Duplicate Detection & Hashing
    console.log('\n--- TEST 2: Duplicate Detection & Content Hashing ---');
    const hash1 = generateContentHash('VAO & Junior Assistant Recruitment 2026', 'Villupuram Collectorate', 'NOTIF-01');
    const hash2 = generateContentHash('vao & junior assistant recruitment 2026', 'villupuram collectorate', 'notif-01');
    assert(hash1 === hash2, 'Normalized content hashing produces identical hash regardless of casing/spacing');

    const dupCheck = await detectDuplicateOrRevision(
      { title: 'Brand New Unique Job Post ' + Date.now(), organization: 'Tamil Nadu Board', sourceUrl: 'https://unique.tn.gov.in/job/' + Date.now() },
      'job',
      new mongoose.Types.ObjectId(),
      'TN Board'
    );
    assert(dupCheck.isDuplicate === false, 'Brand new record marked as non-duplicate');

    // TEST 3: PDF Regex Structured Extraction
    console.log('\n--- TEST 3: PDF Structured Extraction ---');
    const samplePdfText = `
      TAMIL NADU PUBLIC SERVICE COMMISSION: CHENNAI
      NOTIFICATION NO. 04/2026.
      Total Number of Vacancies: 6244
      Educational Qualification: Must have passed S.S.L.C. Public Examination or equivalent.
      Age Limit: 18 to 37 Years as on 01/07/2026.
      Application Fee: Rs. 100 registration fee.
      Selection Process: Single Paper Written Examination and Certificate Verification.
      Last Date for submission: 28/07/2026.
    `;
    const parsedPdf = extractRecruitmentDetailsFromText(samplePdfText);
    assert(parsedPdf.notificationNumber === '04/2026', `Extracted notification number: ${parsedPdf.notificationNumber}`);
    assert(parsedPdf.totalVacancies === 6244, `Extracted total vacancies: ${parsedPdf.totalVacancies}`);
    assert(parsedPdf.confidenceScore >= 80, `High confidence score: ${parsedPdf.confidenceScore}%`);
    assert(parsedPdf.missingFields.length === 0, `No critical fields missing. Missing: ${parsedPdf.missingFields.join(', ')}`);

    // TEST 4: AI Summarization & Content Processing (Tamil & English)
    console.log('\n--- TEST 4: AI Summarization & Content Processing (Tamil Translation) ---');
    const aiItem = {
      title: 'Solar Water Pump Subsidy Scheme for Nesal and Vanur Farmers',
      rawContent: 'Tamil Nadu Energy Development Agency (TEDA) invites online applications from farmers in Villupuram district for 5HP to 10HP solar agricultural pump sets with 70% state subsidy.',
      recordType: 'news'
    };
    const processedAI = await processContentWithAI(aiItem, { sourceName: 'TNAU & Villupuram Agriculture Department', recordType: 'news' });
    assert(processedAI.summaryEnglish && processedAI.summaryEnglish.length > 20, 'Generated concise English summary');
    assert(processedAI.summaryTamil && processedAI.summaryTamil.length > 20, 'Generated natural Tamil translated summary');
    assert(processedAI.categoryIdentified === 'Agriculture' || processedAI.categoryIdentified === 'Government Schemes', `Accurate category classified: ${processedAI.categoryIdentified}`);
    assert(processedAI.confidenceScore > 75, `Confidence score calculated: ${processedAI.confidenceScore}%`);

    // TEST 5: Real Crawler Engine Execution on Configured Source
    console.log('\n--- TEST 5: Real Crawler Engine Execution on Configured Sources ---');
    const distSource = await CrawlerSource.findOne({ adapterKey: 'district_news' });
    assert(!!distSource, `Found District Crawler Source (${distSource?.name})`);

    const crawlResult = await executeCrawl(distSource._id, 'manual');
    assert(crawlResult.success === true, 'Crawl execution completed successfully');
    assert(crawlResult.recordsFound > 0, `Extracted ${crawlResult.recordsFound} records`);
    assert(crawlResult.recordsNew >= 0 || crawlResult.recordsUpdated >= 0, 'Processed candidate records');

    // TEST 6: Admin Approval & Publishing Workflow
    console.log('\n--- TEST 6: Admin Approval and Publishing to Public Experience ---');
    let pendingApproval = await ContentApproval.findOne({ status: 'pending' }).populate('recordId');
    if (!pendingApproval) {
      // Trigger NCS job crawl to queue fresh items
      const ncsSource = await CrawlerSource.findOne({ adapterKey: 'ncs_jobs' });
      if (ncsSource) await executeCrawl(ncsSource._id, 'manual');
      pendingApproval = await ContentApproval.findOne({ status: 'pending' }).populate('recordId');
    }
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
