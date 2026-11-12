import express from 'express';
import JobVacancy from '../models/JobVacancy.js';
import RecruitmentNotification from '../models/RecruitmentNotification.js';
import NewsArticle from '../models/NewsArticle.js';
import InAppNotification from '../models/InAppNotification.js';

const router = express.Router();

// Public Jobs endpoint with filters
router.get('/jobs', async (req, res) => {
  try {
    const { category, search, location, district, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.jobCategory = category;
    }
    if (district) {
      filter.district = new RegExp(district, 'i');
    }
    if (location) {
      filter.jobLocation = new RegExp(location, 'i');
    }
    if (search) {
      filter.$or = [
        { jobTitle: new RegExp(search, 'i') },
        { organizationName: new RegExp(search, 'i') },
        { qualification: new RegExp(search, 'i') }
      ];
    }

    const total = await JobVacancy.countDocuments(filter);
    const jobs = await JobVacancy.find(filter)
      .sort({ isImportant: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Public Recruitment Notifications endpoint
router.get('/recruitments', async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { recruitmentName: new RegExp(search, 'i') },
        { organization: new RegExp(search, 'i') },
        { notificationNumber: new RegExp(search, 'i') }
      ];
    }

    const total = await RecruitmentNotification.countDocuments(filter);
    const recruitments = await RecruitmentNotification.find(filter)
      .sort({ isImportant: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, recruitments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Public News Articles endpoint
router.get('/news', async (req, res) => {
  try {
    const { category, scope, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (scope && scope !== 'All') {
      filter['geographicRelevance.scope'] = scope;
    }
    if (search) {
      filter.$or = [
        { headline: new RegExp(search, 'i') },
        { shortDescription: new RegExp(search, 'i') },
        { summaryEnglish: new RegExp(search, 'i') }
      ];
    }

    const total = await NewsArticle.countDocuments(filter);
    const news = await NewsArticle.find(filter)
      .sort({ isImportant: -1, publishedDate: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Public District & Village Announcements
router.get('/announcements', async (req, res) => {
  try {
    const filter = {
      category: { $in: ['Important Announcements', 'Government Schemes', 'District News', 'Village News'] }
    };
    const announcements = await NewsArticle.find(filter)
      .sort({ isImportant: -1, publishedDate: -1 })
      .limit(15);

    res.json({ success: true, announcements });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// In-app Notifications
router.get('/notifications', async (req, res) => {
  try {
    const { category, limit = 20 } = req.query;
    const filter = {};
    if (category && category !== 'All') {
      filter.category = category;
    }

    const notifications = await InAppNotification.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
