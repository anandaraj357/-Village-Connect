import express from 'express';
import JobVacancy from '../models/JobVacancy.js';
import RecruitmentNotification from '../models/RecruitmentNotification.js';
import NewsArticle from '../models/NewsArticle.js';
import InAppNotification from '../models/InAppNotification.js';
import ContentApproval from '../models/ContentApproval.js';
import { extractNewsForLocation } from '../crawler/core/locationNewsCrawler.js';

const router = express.Router();

export const TAMIL_NADU_DISTRICTS = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore',
  'Dharmapuri', 'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram',
  'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai',
  'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
  'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi',
  'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
  'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur',
  'Vellore', 'Villupuram', 'Virudhunagar'
];

// List of all Tamil Nadu districts
router.get('/districts', (req, res) => {
  res.json({
    success: true,
    state: 'Tamil Nadu',
    districts: TAMIL_NADU_DISTRICTS
  });
});

// Public Jobs endpoint with rich Tamil Nadu state-wide filters
router.get('/jobs', async (req, res) => {
  try {
    const { category, search, location, district, qualification, jobType, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (category && category !== 'All' && category !== 'All Categories') {
      filter.jobCategory = new RegExp(`^${category}$`, 'i');
    }
    if (district && district !== 'All' && district !== 'All Tamil Nadu') {
      filter.$or = [
        { district: new RegExp(district, 'i') },
        { jobLocation: new RegExp(district, 'i') }
      ];
    }
    if (location) {
      const locRegex = new RegExp(location, 'i');
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: [{ jobLocation: locRegex }, { district: locRegex }] }];
        delete filter.$or;
      } else {
        filter.jobLocation = locRegex;
      }
    }
    if (qualification && qualification !== 'All') {
      filter.qualification = new RegExp(qualification, 'i');
    }
    if (jobType && jobType !== 'All') {
      filter.jobType = new RegExp(jobType, 'i');
    }
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const searchCond = [
        { jobTitle: searchRegex },
        { organizationName: searchRegex },
        { qualification: searchRegex },
        { jobDescription: searchRegex },
        { jobLocation: searchRegex },
        { district: searchRegex }
      ];
      if (filter.$and) {
        filter.$and.push({ $or: searchCond });
      } else if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchCond }];
        delete filter.$or;
      } else {
        filter.$or = searchCond;
      }
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

// Public Recruitment Notifications endpoint with Tamil Nadu search & organization filters
router.get('/recruitments', async (req, res) => {
  try {
    const { search, organization, district, category, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (organization && organization !== 'All') {
      filter.organization = new RegExp(organization, 'i');
    }
    if (category && category !== 'All') {
      filter.category = new RegExp(category, 'i');
    }
    if (district && district !== 'All' && district !== 'All Tamil Nadu') {
      filter.$or = [
        { district: new RegExp(district, 'i') },
        { department: new RegExp(district, 'i') },
        { pdfExtractedText: new RegExp(district, 'i') }
      ];
    }
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      const searchCond = [
        { recruitmentName: searchRegex },
        { organization: searchRegex },
        { notificationNumber: searchRegex },
        { postNames: searchRegex },
        { eligibility: searchRegex },
        { department: searchRegex }
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchCond }];
        delete filter.$or;
      } else {
        filter.$or = searchCond;
      }
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

/**
 * POST /api/public/jobs/post
 * Allows citizens, employers, organizations, and panchayat members to post
 * job vacancy details or recruitment notifications across Tamil Nadu.
 */
router.post('/jobs/post', async (req, res) => {
  try {
    const {
      postingType = 'job', // 'job' or 'recruitment'
      title,
      organizationName,
      jobCategory = 'Private',
      jobType = 'Full-Time',
      district = 'Villupuram',
      jobLocation,
      qualification = 'Any Qualification',
      requiredExperience = 'Freshers / Experienced',
      salary = 'Competitive / As per norms',
      vacanciesCount = 1,
      applicationLastDate,
      jobDescription,
      contactPerson,
      contactPhone,
      contactEmail,
      howToApply,
      applicationUrl,
      officialNotificationUrl,
      notificationNumber,
      eligibility,
      ageLimit,
      examDate
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Job or Recruitment Title is required' });
    }
    if (!organizationName || !organizationName.trim()) {
      return res.status(400).json({ success: false, message: 'Organization / Company Name is required' });
    }

    const cleanDistrict = district && district !== 'All' ? district : 'All Tamil Nadu';
    const cleanLocation = jobLocation || (cleanDistrict === 'All Tamil Nadu' ? 'Tamil Nadu (State-wide)' : `${cleanDistrict}, Tamil Nadu`);
    const finalDeadline = applicationLastDate ? new Date(applicationLastDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (postingType === 'recruitment') {
      // Create Recruitment Notification
      const notifNum = notificationNumber || `TN/REC/${Date.now().toString().slice(-6)}`;
      const newRecruitment = await RecruitmentNotification.create({
        recruitmentName: title.trim(),
        organization: organizationName.trim(),
        notificationNumber: notifNum,
        district: cleanDistrict,
        state: 'Tamil Nadu',
        department: jobCategory,
        category: 'Government',
        totalVacancies: Number(vacanciesCount) || 1,
        postNames: [title.trim()],
        eligibility: eligibility || qualification,
        ageLimit: ageLimit || '18 - 35 Years (As per rules)',
        applicationFee: 'See official guidelines',
        selectionProcess: 'Merit / Written Exam / Interview',
        importantDates: {
          notificationDate: new Date(),
          applicationStartDate: new Date(),
          applicationLastDate: finalDeadline,
          examDate: examDate || 'To be announced'
        },
        officialPdfUrl: officialNotificationUrl || applicationUrl || null,
        officialApplicationLink: applicationUrl || null,
        sourceUrl: applicationUrl || 'Community Public Submission',
        contactPhone,
        contactEmail,
        postedBy: {
          userType: 'user',
          name: contactPerson || 'Community Member',
          phone: contactPhone || '',
          email: contactEmail || ''
        },
        status: 'approved',
        confidenceScore: 95,
        isImportant: true,
        pdfExtractedText: `${title} by ${organizationName} in ${cleanDistrict}. Eligibility: ${eligibility || qualification}. Description: ${jobDescription || ''}`
      });

      // Log in ContentApproval for Admin oversight
      await ContentApproval.create({
        recordType: 'recruitment',
        title: title.trim(),
        category: jobCategory,
        sourceName: `User Submission: ${contactPerson || 'Citizen'} (${contactPhone || 'N/A'})`,
        sourceUrl: applicationUrl || 'Community Portal',
        summary: jobDescription || `Recruitment for ${title} at ${organizationName}`,
        summaryTamil: `${organizationName} நிறுவனத்தில் ${title} பணியிடங்களுக்கான பொது அறிவிப்பு.`,
        verificationStatus: 'verified',
        status: 'approved',
        publishedCollection: 'RecruitmentNotifications',
        publishedDocumentId: newRecruitment._id,
        isImportant: true
      });

      // Trigger In-App Notification
      await InAppNotification.create({
        title: `புதிய அரசு/நிறுவன தேர்வு அறிவிப்பு: ${title.slice(0, 40)}`,
        body: `${organizationName} (${cleanDistrict}) - ${vacanciesCount} பணியிடங்கள். கடைசி தேதி: ${finalDeadline.toLocaleDateString()}`,
        category: 'Government Jobs',
        type: 'recruitment',
        isImportant: true
      });

      return res.json({
        success: true,
        message: 'Recruitment notification published successfully across Tamil Nadu!',
        record: newRecruitment,
        type: 'recruitment'
      });
    }

    // Default: Create Job Vacancy
    const newJob = await JobVacancy.create({
      jobTitle: title.trim(),
      organizationName: organizationName.trim(),
      jobCategory,
      jobType,
      qualification,
      requiredExperience,
      salary,
      vacanciesCount: Number(vacanciesCount) || 1,
      jobLocation: cleanLocation,
      district: cleanDistrict,
      state: 'Tamil Nadu',
      applicationStartDate: new Date(),
      applicationLastDate: finalDeadline,
      officialNotificationUrl,
      applicationUrl: applicationUrl || (contactPhone ? `tel:${contactPhone}` : ''),
      sourceWebsite: 'Community & Employer Job Submission',
      jobDescription: jobDescription || `${title} position at ${organizationName}. Location: ${cleanLocation}. Required: ${qualification}.`,
      confidenceScore: 95,
      isImportant: true,
      contactPerson,
      contactPhone,
      contactEmail,
      howToApply: howToApply || (contactPhone ? `Contact ${contactPhone}` : 'Apply online'),
      postedBy: {
        userType: 'user',
        name: contactPerson || 'Community Member',
        phone: contactPhone || '',
        email: contactEmail || ''
      },
      status: 'approved'
    });

    // Log in ContentApproval for Admin oversight
    await ContentApproval.create({
      recordType: 'job',
      title: title.trim(),
      category: jobCategory,
      sourceName: `User Posting: ${contactPerson || 'Citizen'} (${contactPhone || 'N/A'})`,
      sourceUrl: applicationUrl || 'User Posting',
      summary: jobDescription || `${title} at ${organizationName}`,
      summaryTamil: `${organizationName} நிறுவனத்தில் ${title} பணி வாய்ப்பு (${cleanDistrict}).`,
      verificationStatus: 'verified',
      status: 'approved',
      publishedCollection: 'JobVacancies',
      publishedDocumentId: newJob._id,
      isImportant: true
    });

    // Trigger In-App Notification
    await InAppNotification.create({
      title: `புதிய வேலைவாய்ப்பு: ${title.slice(0, 40)}`,
      body: `${organizationName} (${cleanDistrict}) - சம்பளம்: ${salary}. பணியிடங்கள்: ${vacanciesCount}`,
      category: 'Job Vacancies',
      type: 'job',
      isImportant: true
    });

    res.json({
      success: true,
      message: 'Job vacancy published successfully across Tamil Nadu!',
      job: newJob,
      type: 'job'
    });
  } catch (err) {
    console.error('[Public Job Post Error]:', err);
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
