import express from 'express';
import JobVacancy from '../models/JobVacancy.js';
import RecruitmentNotification from '../models/RecruitmentNotification.js';
import NewsArticle from '../models/NewsArticle.js';
import InAppNotification from '../models/InAppNotification.js';
import { extractNewsForLocation } from '../crawler/core/locationNewsCrawler.js';

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

function escapeRegex(text) {
  return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Extract news on-demand by GPS or selected District/State
router.post('/news/extract-by-location', async (req, res) => {
  try {
    const { state, district, mandal, village, lat, lng } = req.body || {};
    const result = await extractNewsForLocation({
      state: state || 'Tamil Nadu',
      district: district || 'Villupuram',
      mandal: mandal || 'General',
      village: village || 'All',
      gps: lat && lng ? { lat: Number(lat), lng: Number(lng) } : null
    });
    res.json(result);
  } catch (err) {
    console.error(`[ExtractByLocation Error]: ${err.message}`);
    res.json({
      success: true,
      district: req.body?.district || 'Villupuram',
      state: req.body?.state || 'Tamil Nadu',
      newCount: 0,
      totalCount: 0,
      news: [],
      warning: err.message
    });
  }
});

// Public News Articles endpoint
router.get('/news', async (req, res) => {
  try {
    const { category, scope, search, district, state, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (scope && scope !== 'All') {
      filter['geographicRelevance.scope'] = scope;
    }
    if (district) {
      const safeDist = escapeRegex(district);
      filter['$or'] = [
        { 'geographicRelevance.district': new RegExp(safeDist, 'i') },
        { 'geographicRelevance.scope': { $in: ['State', 'Tamil Nadu', 'Andhra Pradesh', 'National'] } }
      ];
    }
    if (state) {
      filter['geographicRelevance.state'] = new RegExp(escapeRegex(state), 'i');
    }
    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), 'i');
      const searchCond = [
        { headline: searchRegex },
        { shortDescription: searchRegex },
        { summaryEnglish: searchRegex },
        { summaryTamil: searchRegex }
      ];
      if (filter['$or']) {
        filter['$and'] = [{ $or: filter['$or'] }, { $or: searchCond }];
        delete filter['$or'];
      } else {
        filter['$or'] = searchCond;
      }
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
    const { district, state } = req.query;
    const filter = {
      category: { $in: ['Important Announcements', 'Government Schemes', 'District News', 'Village News'] }
    };

    if (district) {
      filter['$or'] = [
        { 'geographicRelevance.district': new RegExp(escapeRegex(district), 'i') },
        { 'geographicRelevance.scope': { $in: ['State', 'Tamil Nadu', 'Andhra Pradesh', 'National'] } }
      ];
    }
    if (state) {
      filter['geographicRelevance.state'] = new RegExp(escapeRegex(state), 'i');
    }

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
