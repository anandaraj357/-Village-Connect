import crypto from 'crypto';
import CrawledRecord from '../../models/CrawledRecord.js';
import RecruitmentNotification from '../../models/RecruitmentNotification.js';
import JobVacancy from '../../models/JobVacancy.js';
import NewsArticle from '../../models/NewsArticle.js';
import ContentRevision from '../../models/ContentRevision.js';
import CrawlingLog from '../../models/CrawlingLog.js';

export function normalizeTitle(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function generateContentHash(title, orgOrCategory, extraKey = '') {
  const normTitle = normalizeTitle(title);
  const normOrg = normalizeTitle(orgOrCategory || '');
  const normExtra = normalizeTitle(extraKey || '');
  return crypto
    .createHash('sha256')
    .update(`${normTitle}|${normOrg}|${normExtra}`)
    .digest('hex');
}

/**
 * Checks if incoming item is a duplicate, a revision of an existing record, or a brand new record
 */
export async function detectDuplicateOrRevision(item, recordType, sourceId, sourceName) {
  const canonicalUrl = item.canonicalUrl || item.sourceUrl || item.url || item.link;
  const title = item.title || item.jobTitle || item.recruitmentName || item.headline || '';
  const org = item.organizationName || item.organization || item.category || '';
  const notifNum = item.notificationNumber || item.notificationNo || null;
  const contentHash = generateContentHash(title, org, notifNum || canonicalUrl);

  // 1. Check for exact content hash match in CrawledRecords
  const existingByHash = await CrawledRecord.findOne({ contentHash });
  if (existingByHash) {
    return {
      isDuplicate: true,
      duplicateType: 'EXACT_HASH_MATCH',
      existingRecordId: existingByHash._id,
      contentHash,
      isRevision: false
    };
  }

  // 2. Check canonical URL match
  if (canonicalUrl) {
    const existingByUrl = await CrawledRecord.findOne({ canonicalUrl, recordType });
    if (existingByUrl) {
      // If notification number matches but details (like dates or vacancies) changed -> REVISION
      if (recordType === 'recruitment' && notifNum) {
        return {
          isDuplicate: false,
          isRevision: true,
          revisionTargetId: existingByUrl._id,
          notificationNumber: notifNum,
          contentHash,
          reason: 'Notification update detected for existing notification number'
        };
      }

      return {
        isDuplicate: true,
        duplicateType: 'CANONICAL_URL_MATCH',
        existingRecordId: existingByUrl._id,
        contentHash,
        isRevision: false
      };
    }
  }

  // 3. For recruitment notifications: check if notificationNumber already exists in published RecruitmentNotification
  if (recordType === 'recruitment' && notifNum) {
    const existingPublishedRecruitment = await RecruitmentNotification.findOne({ notificationNumber: notifNum });
    if (existingPublishedRecruitment) {
      return {
        isDuplicate: false,
        isRevision: true,
        revisionTargetId: existingPublishedRecruitment._id,
        publishedTargetCollection: 'RecruitmentNotifications',
        notificationNumber: notifNum,
        contentHash,
        reason: `Update detected for published recruitment notification ${notifNum}`
      };
    }
  }

  // 4. Normalized title match within the same source over recent time
  const recentRecords = await CrawledRecord.find({
    sourceId,
    recordType,
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // last 30 days
  }).select('title contentHash _id');

  const incomingNorm = normalizeTitle(title);
  for (const rec of recentRecords) {
    if (normalizeTitle(rec.title) === incomingNorm) {
      return {
        isDuplicate: true,
        duplicateType: 'NORMALIZED_TITLE_MATCH',
        existingRecordId: rec._id,
        contentHash,
        isRevision: false
      };
    }
  }

  // Brand new item
  return {
    isDuplicate: false,
    isRevision: false,
    contentHash
  };
}

/**
 * Creates a revision record when an existing recruitment notification is updated
 */
export async function createContentRevision({
  targetCollection,
  targetDocumentId,
  notificationNumber,
  previousState,
  newState,
  updatedFields,
  sourceUrl,
  changeSummary,
  approvedBy = null
}) {
  const currentCount = await ContentRevision.countDocuments({ targetDocumentId });
  const revision = new ContentRevision({
    targetCollection,
    targetDocumentId,
    notificationNumber,
    revisionNumber: currentCount + 1,
    changeSummary: changeSummary || `Revision ${currentCount + 1}: Updated details`,
    previousState,
    newState,
    updatedFields,
    sourceUrl,
    approvedBy
  });
  await revision.save();
  return revision;
}
