import CrawlerSource from '../../models/CrawlerSource.js';
import CrawlerJob from '../../models/CrawlerJob.js';
import CrawledRecord from '../../models/CrawledRecord.js';
import CrawlingLog from '../../models/CrawlingLog.js';
import ContentApproval from '../../models/ContentApproval.js';
import ContentRevision from '../../models/ContentRevision.js';
import { getAdapterForSource } from '../adapters/registry.js';
import { processContentWithAI } from '../ai/geminiProcessor.js';
import { detectDuplicateOrRevision, createContentRevision } from './duplicateDetector.js';

// In-memory mutex locks to prevent overlapping crawls for the same source
const activeCrawls = new Set();

/**
 * Unified Crawler Execution Engine
 */
export async function executeCrawl(sourceId, triggerType = 'manual', bullJobId = null) {
  const source = await CrawlerSource.findById(sourceId);
  if (!source) {
    throw new Error(`Crawler source with ID ${sourceId} not found`);
  }

  const lockKey = String(source._id);
  if (activeCrawls.has(lockKey)) {
    throw new Error(`Crawler is already running for source: ${source.name} (Source ID: ${lockKey})`);
  }

  activeCrawls.add(lockKey);
  const startTime = Date.now();

  const crawlerJob = new CrawlerJob({
    sourceId: source._id,
    sourceName: source.name,
    jobType: source.category,
    bullJobId: bullJobId || `manual-${Date.now()}`,
    status: 'running',
    triggerType,
    startedAt: new Date()
  });
  await crawlerJob.save();

  source.lastStatus = 'in_progress';
  source.lastCrawledAt = new Date();
  source.totalCrawlCount += 1;
  await source.save();

  await logActivity(source._id, source.name, crawlerJob._id, 'info', 'CRAWL_STARTED', `Initiated ${triggerType} crawl for ${source.name} [Adapter: ${source.adapterKey}]`);

  let recordsFound = 0;
  let recordsNew = 0;
  let recordsUpdated = 0;
  let recordsDuplicates = 0;
  const errors = [];

  try {
    const adapter = getAdapterForSource(source);
    await logActivity(source._id, source.name, crawlerJob._id, 'info', 'FETCHING_CONTENT', `Fetching remote data via ${source.crawlerType} engine from ${source.url}`);
    
    const rawItems = await adapter.crawl();
    recordsFound = rawItems.length;
    await logActivity(source._id, source.name, crawlerJob._id, 'info', 'CONTENT_EXTRACTED', `Extracted ${recordsFound} candidate records from ${source.name}`);

    for (const item of rawItems) {
      try {
        const dupResult = await detectDuplicateOrRevision(item, source.category, source._id, source.name);

        if (dupResult.isDuplicate) {
          recordsDuplicates++;
          await logActivity(source._id, source.name, crawlerJob._id, 'debug', 'DUPLICATE_SKIPPED', `Duplicate detected: "${item.title}". Matched by ${dupResult.duplicateType}`);
          continue;
        }

        await logActivity(source._id, source.name, crawlerJob._id, 'info', 'AI_PROCESSING', `Processing item with AI: "${item.title}"`);
        const aiResult = await processContentWithAI(item, {
          sourceName: source.name,
          recordType: source.category
        });

        if (dupResult.isRevision) {
          recordsUpdated++;
          const targetDocId = dupResult.revisionTargetId;
          await createContentRevision({
            targetCollection: dupResult.publishedTargetCollection || 'RecruitmentNotifications',
            targetDocumentId: targetDocId,
            notificationNumber: dupResult.notificationNumber || item.notificationNumber,
            changeSummary: dupResult.reason || 'Notification updated by external publisher',
            previousState: {},
            newState: item,
            updatedFields: Object.keys(item),
            sourceUrl: item.canonicalUrl || source.url
          });
          await logActivity(source._id, source.name, crawlerJob._id, 'info', 'REVISION_CREATED', `Created revision history for notification ${dupResult.notificationNumber}`);
          continue;
        }

        const crawledRecord = new CrawledRecord({
          sourceId: source._id,
          sourceName: source.name,
          sourceUrl: item.sourceUrl || item.link || source.url,
          canonicalUrl: item.canonicalUrl || item.link || source.url,
          recordType: source.category,
          title: item.title,
          contentHash: dupResult.contentHash,
          rawContent: item.rawContent || '',
          cleanedContent: aiResult.cleanedContent,
          extractedData: {
            ...item,
            ...(aiResult.extractedData || {})
          },
          aiProcessed: true,
          aiAnalysis: {
            summaryEnglish: aiResult.summaryEnglish,
            summaryTamil: aiResult.summaryTamil,
            summaryTelugu: aiResult.summaryTelugu,
            confidenceScore: aiResult.confidenceScore,
            categoryIdentified: aiResult.categoryIdentified,
            missingFields: aiResult.missingFields,
            authenticityScore: aiResult.authenticityScore,
            verificationFlags: aiResult.verificationFlags,
            aiModel: aiResult.aiModel
          },
          approvalStatus: 'pending',
          isDuplicate: false,
          crawledAt: new Date()
        });
        await crawledRecord.save();

        const contentApproval = new ContentApproval({
          recordId: crawledRecord._id,
          recordType: source.category,
          title: crawledRecord.title,
          category: aiResult.categoryIdentified,
          sourceName: source.name,
          sourceUrl: crawledRecord.sourceUrl,
          publicationDate: item.datePublished || item.publishedDate || new Date(),
          summary: aiResult.summaryEnglish,
          summaryTamil: aiResult.summaryTamil,
          summaryTelugu: aiResult.summaryTelugu,
          confidenceScore: aiResult.confidenceScore,
          verificationStatus: aiResult.confidenceScore >= 80 ? 'verified' : 'needs_review',
          status: 'pending',
          isImportant: false
        });
        await contentApproval.save();

        recordsNew++;
        await logActivity(source._id, source.name, crawlerJob._id, 'info', 'RECORD_QUEUED_APPROVAL', `Record "${crawledRecord.title}" successfully queued for administrator approval.`);
      } catch (itemErr) {
        errors.push(`Item error [${item.title}]: ${itemErr.message}`);
        await logActivity(source._id, source.name, crawlerJob._id, 'warn', 'ITEM_PROCESSING_ERROR', `Failed processing item: ${itemErr.message}`);
      }
    }

    const durationMs = Date.now() - startTime;
    crawlerJob.status = 'completed';
    crawlerJob.completedAt = new Date();
    crawlerJob.durationMs = durationMs;
    crawlerJob.recordsFound = recordsFound;
    crawlerJob.recordsNew = recordsNew;
    crawlerJob.recordsUpdated = recordsUpdated;
    crawlerJob.recordsDuplicates = recordsDuplicates;
    crawlerJob.errors = errors;
    await crawlerJob.save();

    source.lastStatus = 'success';
    source.successCount += 1;
    source.lastExtractedCount = recordsNew;
    source.lastErrorMessage = null;
    await source.save();

    await logActivity(source._id, source.name, crawlerJob._id, 'info', 'CRAWL_COMPLETED', `Crawl completed in ${durationMs}ms. Found: ${recordsFound}, New: ${recordsNew}, Updated: ${recordsUpdated}, Duplicates: ${recordsDuplicates}`);

    return {
      success: true,
      jobId: crawlerJob._id,
      recordsFound,
      recordsNew,
      recordsUpdated,
      recordsDuplicates,
      durationMs
    };
  } catch (err) {
    const durationMs = Date.now() - startTime;
    crawlerJob.status = 'failed';
    crawlerJob.completedAt = new Date();
    crawlerJob.durationMs = durationMs;
    crawlerJob.errors.push(err.message);
    await crawlerJob.save();

    source.lastStatus = 'failed';
    source.failureCount += 1;
    source.lastErrorMessage = err.message;
    await source.save();

    await logActivity(source._id, source.name, crawlerJob._id, 'error', 'CRAWL_FAILED', `Crawl terminated with error: ${err.message}`);

    throw err;
  } finally {
    activeCrawls.delete(lockKey);
  }
}

async function logActivity(sourceId, sourceName, jobId, level, action, message, metadata = null) {
  try {
    const log = new CrawlingLog({
      sourceId,
      sourceName,
      jobId,
      level,
      action,
      message,
      metadata
    });
    await log.save();
    console.log(`[CrawlerLog][${level.toUpperCase()}] ${action}: ${message}`);
  } catch (err) {
    console.error(`Failed to write crawler log: ${err.message}`);
  }
}
