import ContentApproval from '../models/ContentApproval.js';
import CrawledRecord from '../models/CrawledRecord.js';
import JobVacancy from '../models/JobVacancy.js';
import RecruitmentNotification from '../models/RecruitmentNotification.js';
import NewsArticle from '../models/NewsArticle.js';
import InAppNotification from '../models/InAppNotification.js';
import NotificationSubscription from '../models/NotificationSubscription.js';
import CrawlingLog from '../models/CrawlingLog.js';

/**
 * Publishes an approved crawled record to the public collections and triggers notifications
 */
export async function publishRecord(approvalId, adminId = null, overrideData = null) {
  const approval = await ContentApproval.findById(approvalId).populate('recordId');
  if (!approval) throw new Error('Content approval record not found');

  const crawled = approval.recordId;
  const mergedData = {
    ...(crawled.extractedData || {}),
    ...(approval.editedFields || {}),
    ...(overrideData || {})
  };

  let publishedDoc = null;
  let targetCollectionName = '';
  let notificationCategory = 'General';
  let notificationTitle = approval.title;

  if (approval.recordType === 'job') {
    targetCollectionName = 'JobVacancies';
    notificationCategory = 'Government Jobs';

    publishedDoc = new JobVacancy({
      jobTitle: mergedData.jobTitle || approval.title,
      organizationName: mergedData.organizationName || approval.sourceName,
      jobCategory: mergedData.jobCategory || 'Government',
      qualification: mergedData.qualification || 'As per official notification',
      requiredExperience: mergedData.requiredExperience || 'Freshers / Experienced',
      salary: mergedData.salary || 'As per norms',
      vacanciesCount: mergedData.vacanciesCount || 1,
      jobLocation: mergedData.jobLocation || 'Tamil Nadu (Villupuram)',
      district: mergedData.district || 'Villupuram',
      applicationStartDate: mergedData.applicationStartDate || new Date(),
      applicationLastDate: mergedData.applicationLastDate || null,
      officialNotificationUrl: mergedData.officialNotificationUrl || approval.sourceUrl,
      applicationUrl: mergedData.applicationUrl || approval.sourceUrl,
      sourceWebsite: approval.sourceName,
      datePublished: approval.publicationDate,
      dateCrawled: crawled.crawledAt,
      jobDescription: approval.summary || mergedData.jobDescription,
      originalPdfUrl: mergedData.originalPdfUrl,
      confidenceScore: approval.confidenceScore,
      isImportant: approval.isImportant,
      approvalId: approval._id,
      originalRecordId: crawled._id
    });
    await publishedDoc.save();
  } else if (approval.recordType === 'recruitment') {
    targetCollectionName = 'RecruitmentNotifications';
    notificationCategory = 'Recruitment Alerts';

    publishedDoc = new RecruitmentNotification({
      recruitmentName: mergedData.recruitmentName || approval.title,
      organization: mergedData.organization || approval.sourceName,
      notificationNumber: mergedData.notificationNumber || `REC-${Date.now().toString().slice(-6)}`,
      totalVacancies: mergedData.totalVacancies || 0,
      postNames: mergedData.postNames || [approval.title],
      eligibility: mergedData.eligibility || 'Check official PDF notification',
      ageLimit: mergedData.ageLimit || 'Unavailable',
      applicationFee: mergedData.applicationFee || 'Unavailable',
      selectionProcess: mergedData.selectionProcess || 'Written Exam / Merit / Interview',
      importantDates: mergedData.importantDates || {
        notificationDate: approval.publicationDate,
        applicationStartDate: new Date(),
        applicationLastDate: mergedData.applicationLastDate || null,
        examDate: 'To be announced'
      },
      officialPdfUrl: mergedData.officialPdfUrl,
      officialApplicationLink: mergedData.officialApplicationLink || approval.sourceUrl,
      sourceUrl: approval.sourceUrl,
      pdfExtractedText: mergedData.pdfExtractedText || '',
      missingFields: mergedData.missingFields || [],
      confidenceScore: approval.confidenceScore,
      isImportant: approval.isImportant,
      approvalId: approval._id,
      originalRecordId: crawled._id
    });
    await publishedDoc.save();
  } else {
    // news or announcement
    targetCollectionName = 'NewsArticles';
    notificationCategory = approval.category || 'District News';

    publishedDoc = new NewsArticle({
      headline: mergedData.headline || approval.title,
      shortDescription: approval.summary || mergedData.shortDescription,
      summaryEnglish: approval.summary || '',
      summaryTamil: approval.summaryTamil || approval.summary || '',
      summaryTelugu: approval.summaryTelugu || approval.summaryTamil || '',
      category: approval.category || 'District News',
      sourceWebsite: approval.sourceName,
      originalArticleUrl: approval.sourceUrl,
      thumbnailUrl: mergedData.thumbnailUrl,
      geographicRelevance: mergedData.geographicRelevance || {
        scope: 'District',
        state: 'Tamil Nadu',
        district: 'Villupuram',
        mandal: 'Vanur',
        village: 'Nesal'
      },
      publishedDate: approval.publicationDate,
      crawledDate: crawled.crawledAt,
      confidenceScore: approval.confidenceScore,
      isImportant: approval.isImportant,
      approvalId: approval._id,
      originalRecordId: crawled._id
    });
    await publishedDoc.save();
  }

  // Update approval and crawled record status
  approval.status = 'published';
  approval.publishedCollection = targetCollectionName;
  approval.publishedDocumentId = publishedDoc._id;
  approval.reviewedAt = new Date();
  if (adminId) approval.reviewedBy = adminId;
  await approval.save();

  crawled.approvalStatus = 'published';
  crawled.publishedAt = new Date();
  await crawled.save();

  // Create In-App Notification
  const inAppNotif = new InAppNotification({
    title: `New ${notificationCategory}: ${notificationTitle}`,
    body: approval.summaryTamil ? approval.summaryTamil.slice(0, 180) + '...' : (approval.summary ? approval.summary.slice(0, 180) + '...' : notificationTitle),
    category: notificationCategory,
    type: approval.recordType,
    referenceId: publishedDoc._id,
    link: approval.sourceUrl,
    isImportant: approval.isImportant
  });
  await inAppNotif.save();

  const matchingSubscribersCount = await NotificationSubscription.countDocuments({
    active: true,
    $or: [{ categories: 'All' }, { categories: notificationCategory }]
  });

  await CrawlingLog.create({
    sourceId: crawled.sourceId,
    sourceName: approval.sourceName,
    level: 'info',
    action: 'RECORD_PUBLISHED',
    message: `Record "${approval.title}" published to public collection ${targetCollectionName}. Notified ${matchingSubscribersCount} subscribers.`,
    metadata: {
      approvalId: approval._id,
      publishedDocId: publishedDoc._id,
      subscribersCount: matchingSubscribersCount
    }
  });

  return {
    success: true,
    publishedDocument: publishedDoc,
    collection: targetCollectionName,
    notifiedSubscribers: matchingSubscribersCount
  };
}
