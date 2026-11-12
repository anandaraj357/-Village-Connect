import express from 'express';
import CrawlerSource from '../models/CrawlerSource.js';
import CrawlerJob from '../models/CrawlerJob.js';
import CrawledRecord from '../models/CrawledRecord.js';
import ContentApproval from '../models/ContentApproval.js';
import JobVacancy from '../models/JobVacancy.js';
import RecruitmentNotification from '../models/RecruitmentNotification.js';
import NewsArticle from '../models/NewsArticle.js';
import CrawlingLog from '../models/CrawlingLog.js';

const router = express.Router();

router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalWebsites,
      activeCrawlers,
      successfulCrawls,
      failedCrawls,
      totalJobs,
      totalRecruitments,
      totalNews,
      pendingApprovals,
      publishedRecords,
      duplicatesCount,
      sources,
      recentJobs
    ] = await Promise.all([
      CrawlerSource.countDocuments(),
      CrawlerSource.countDocuments({ enabled: true }),
      CrawlerJob.countDocuments({ status: 'completed' }),
      CrawlerJob.countDocuments({ status: 'failed' }),
      JobVacancy.countDocuments(),
      RecruitmentNotification.countDocuments(),
      NewsArticle.countDocuments(),
      ContentApproval.countDocuments({ status: 'pending' }),
      ContentApproval.countDocuments({ status: 'published' }),
      CrawledRecord.countDocuments({ isDuplicate: true }),
      CrawlerSource.find().select('name category crawlerType lastStatus lastCrawledAt totalCrawlCount successCount failureCount lastExtractedCount').lean(),
      CrawlerJob.find().sort({ createdAt: -1 }).limit(10).lean()
    ]);

    // Date-wise statistics (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dateWiseStats = await CrawlerJob.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalRuns: { $sum: 1 },
          successfulRuns: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          failedRuns: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
          recordsFound: { $sum: '$recordsFound' },
          recordsNew: { $sum: '$recordsNew' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Source-wise performance reports
    const sourcePerformance = sources.map((s) => ({
      id: s._id,
      name: s.name,
      category: s.category,
      type: s.crawlerType,
      status: s.lastStatus,
      lastCrawled: s.lastCrawledAt,
      totalRuns: s.totalCrawlCount || 0,
      successRate: s.totalCrawlCount > 0 ? Math.round(((s.successCount || 0) / s.totalCrawlCount) * 100) : 100,
      extractedCount: s.lastExtractedCount || 0
    }));

    res.json({
      success: true,
      stats: {
        totalWebsites,
        activeCrawlers,
        successfulCrawlingOperations: successfulCrawls,
        failedCrawlingOperations: failedCrawls,
        totalExtractedJobs: totalJobs,
        totalRecruitmentNotifications: totalRecruitments,
        totalNewsArticles: totalNews,
        pendingApprovals,
        publishedRecords,
        duplicateRecordsDetected: duplicatesCount
      },
      dateWiseStats,
      sourcePerformance,
      recentJobs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
