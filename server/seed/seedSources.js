import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CrawlerSource from '../models/CrawlerSource.js';
import User from '../models/User.js';
import JobVacancy from '../models/JobVacancy.js';
import RecruitmentNotification from '../models/RecruitmentNotification.js';
import NewsArticle from '../models/NewsArticle.js';
import ContentApproval from '../models/ContentApproval.js';
import CrawledRecord from '../models/CrawledRecord.js';
import InAppNotification from '../models/InAppNotification.js';

dotenv.config();

const INITIAL_SOURCES = [
  {
    name: 'National Career Service (NCS) - AP Region',
    url: 'https://www.ncs.gov.in',
    category: 'job',
    subCategory: 'government',
    crawlerType: 'static_html',
    adapterKey: 'ncs_jobs',
    scheduleIntervalMinutes: 120,
    geographicScope: 'Andhra Pradesh',
    district: 'Guntur',
    mandal: 'Tenali',
    village: 'Angalakuduru',
    enabled: true,
    trusted: true
  },
  {
    name: 'Employment News / Rozgar Samachar',
    url: 'https://employmentnews.gov.in',
    category: 'job',
    subCategory: 'government',
    crawlerType: 'static_html',
    adapterKey: 'employment_news',
    scheduleIntervalMinutes: 120,
    geographicScope: 'National',
    district: 'Guntur',
    enabled: true,
    trusted: true
  },
  {
    name: 'Andhra Pradesh Public Service Commission (APPSC)',
    url: 'https://psc.ap.gov.in',
    category: 'recruitment',
    subCategory: 'state_government',
    crawlerType: 'static_html',
    adapterKey: 'appsc_recruitment',
    scheduleIntervalMinutes: 120,
    geographicScope: 'Andhra Pradesh',
    district: 'Guntur',
    enabled: true,
    trusted: true
  },
  {
    name: 'SSC & Railway Recruitment Boards (South Central)',
    url: 'https://ssc.gov.in',
    category: 'recruitment',
    subCategory: 'central_government',
    crawlerType: 'static_html',
    adapterKey: 'ssc_upsc',
    scheduleIntervalMinutes: 120,
    geographicScope: 'National',
    district: 'Guntur',
    enabled: true,
    trusted: true
  },
  {
    name: 'Guntur District Administration & Collectorate',
    url: 'https://guntur.ap.gov.in',
    category: 'news',
    subCategory: 'district',
    crawlerType: 'static_html',
    adapterKey: 'district_news',
    scheduleIntervalMinutes: 45,
    geographicScope: 'District',
    district: 'Guntur',
    mandal: 'Tenali',
    enabled: true,
    trusted: true
  },
  {
    name: 'Angalakuduru Village & Rythu Bharosa Kendra Bulletin',
    url: 'https://agri.ap.gov.in',
    category: 'news',
    subCategory: 'agriculture',
    crawlerType: 'rss',
    adapterKey: 'village_news',
    scheduleIntervalMinutes: 45,
    geographicScope: 'Village',
    district: 'Guntur',
    mandal: 'Tenali',
    village: 'Angalakuduru',
    enabled: true,
    trusted: true
  }
];

export async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/our_village_crawler';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
    console.log('[Seed] Connected to MongoDB');

    // 1. Seed Sources
    for (const src of INITIAL_SOURCES) {
      const existing = await CrawlerSource.findOne({ name: src.name });
      if (!existing) {
        await CrawlerSource.create(src);
        console.log(`[Seed] Created source: ${src.name}`);
      }
    }

    // 2. Seed Default Admin User
    const existingAdmin = await User.findOne({ email: 'admin@ourvillage.gov.in' });
    if (!existingAdmin) {
      await User.create({
        name: 'District Administrator',
        email: 'admin@ourvillage.gov.in',
        password: 'Admin@12345',
        role: 'admin',
        village: 'Angalakuduru',
        mandal: 'Tenali',
        district: 'Guntur',
        preferredLanguage: 'te'
      });
      console.log('[Seed] Admin user created (admin@ourvillage.gov.in / Admin@12345)');
    }

    // 3. Seed Verified Public Jobs
    const jobCount = await JobVacancy.countDocuments();
    if (jobCount === 0) {
      await JobVacancy.create([
        {
          jobTitle: 'Junior Assistant & Computer Assistant Vacancy',
          organizationName: 'Guntur District Collectorate & Revenue Unit',
          jobCategory: 'Government',
          qualification: 'Any Degree with Government Technical Examination in Typewriting',
          requiredExperience: 'Freshers eligible',
          salary: '₹25,220 - ₹80,910 (RPS-2022)',
          vacanciesCount: 42,
          jobLocation: 'Guntur & Tenali Sub-Division',
          district: 'Guntur',
          applicationStartDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          applicationLastDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          officialNotificationUrl: 'https://guntur.ap.gov.in/recruitment/junior-assistants-2026',
          applicationUrl: 'https://guntur.ap.gov.in/apply',
          sourceWebsite: 'Guntur District Administration & Collectorate',
          datePublished: new Date(),
          jobDescription: 'Recruitment of Junior Assistants under Group-IV service rules for village and mandal revenue offices.',
          confidenceScore: 98,
          isImportant: true
        },
        {
          jobTitle: 'Field Agri-Officer & Drone Technician',
          organizationName: 'AP Rythu Bharosa Kendram (RBK) Services',
          jobCategory: 'Local Job',
          qualification: 'Diploma in Agriculture / B.Sc Agri / Drone Pilot Certification',
          requiredExperience: '0 - 1 Year',
          salary: '₹24,000 / month',
          vacanciesCount: 16,
          jobLocation: 'Tenali Mandal (Angalakuduru Cluster)',
          district: 'Guntur',
          applicationStartDate: new Date(),
          applicationLastDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          officialNotificationUrl: 'https://agri.ap.gov.in/rbk/drone-pilots-2026',
          applicationUrl: 'https://agri.ap.gov.in/apply',
          sourceWebsite: 'Angalakuduru Village & Rythu Bharosa Kendra Bulletin',
          datePublished: new Date(),
          jobDescription: 'Field operations for agricultural drone spraying, soil health card sampling and fertilizer logistics.',
          confidenceScore: 95,
          isImportant: true
        },
        {
          jobTitle: 'Frontend & Fullstack Software Engineers (Remote / Hybrid)',
          organizationName: 'Amaravati Technology Park & Partner IT Firms',
          jobCategory: 'IT',
          qualification: 'B.Tech / M.Tech / MCA in Computer Science or IT',
          requiredExperience: '1 - 3 Years',
          salary: '₹6,00,000 - ₹12,00,000 / annum',
          vacanciesCount: 28,
          jobLocation: 'Vijayawada / Remote (Work From Home available)',
          district: 'Guntur',
          applicationStartDate: new Date(),
          applicationLastDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          officialNotificationUrl: 'https://www.ncs.gov.in/it-openings-amaravati',
          applicationUrl: 'https://www.ncs.gov.in',
          sourceWebsite: 'National Career Service (NCS) - AP Region',
          datePublished: new Date(),
          jobDescription: 'Software engineer openings with rural talent preference for remote work in web and cloud platforms.',
          confidenceScore: 92,
          isImportant: false
        }
      ]);
      console.log('[Seed] Initial verified jobs seeded.');
    }

    // 4. Seed Verified Recruitment Notifications
    const recCount = await RecruitmentNotification.countDocuments();
    if (recCount === 0) {
      await RecruitmentNotification.create([
        {
          recruitmentName: 'APPSC Group-II Services General Recruitment 2026',
          organization: 'Andhra Pradesh Public Service Commission (APPSC)',
          notificationNumber: 'APPSC/NOTIF/02/2026',
          totalVacancies: 897,
          postNames: ['Municipal Commissioner Grade-III', 'Sub-Registrar Grade-II', 'Assistant Commercial Tax Officer (ACTO)', 'Deputy Tahsildar', 'Assistant Labour Officer'],
          eligibility: 'Must possess a Bachelor Degree of any recognized University in India',
          ageLimit: '18 to 42 Years as on 01/07/2026 (Age relaxations: SC/ST/BC 5 yrs, PwD 10 yrs)',
          applicationFee: '₹250 (Processing fee) + ₹80 (Examination fee; Exempted for reserved categories)',
          selectionProcess: 'Screening Test (Objective Type) and Main Examination (CBT)',
          importantDates: {
            notificationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            applicationStartDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            applicationLastDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
            examDate: 'Preliminary CBT: August 2026'
          },
          officialPdfUrl: 'https://psc.ap.gov.in/Documents/Notifications/Group2_Services_2026.pdf',
          officialApplicationLink: 'https://psc.ap.gov.in/one-time-registration',
          sourceUrl: 'https://psc.ap.gov.in',
          pdfExtractedText: 'ANDHRA PRADESH PUBLIC SERVICE COMMISSION: VIJAYAWADA. NOTIFICATION NO. 02/2026. Group-II Services. Total posts: 897 across Executive and Non-Executive cadres.',
          missingFields: [],
          confidenceScore: 99,
          isImportant: true
        },
        {
          recruitmentName: 'Staff Selection Commission (SSC) Multi-Tasking Staff (MTS) & Havaldar 2026',
          organization: 'Staff Selection Commission (SSC) - Southern Region',
          notificationNumber: 'SSC-SR/MTS-HAV/2026',
          totalVacancies: 9583,
          postNames: ['Multi-Tasking (Non-Technical) Staff', 'Havaldar in CBIC and CBN'],
          eligibility: 'Must have passed Matriculation (10th Class) Examination or equivalent',
          ageLimit: '18-25 years and 18-27 years for Havaldar in CBIC',
          applicationFee: '₹100 (Exempted for Women and SC/ST/PwD)',
          selectionProcess: 'Computer Based Examination in 13 regional languages including Telugu',
          importantDates: {
            notificationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            applicationStartDate: new Date(),
            applicationLastDate: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000),
            examDate: 'October 2026'
          },
          officialPdfUrl: 'https://ssc.gov.in/notice_files/Notice_MTS_2026.pdf',
          officialApplicationLink: 'https://ssc.gov.in',
          sourceUrl: 'https://ssc.gov.in',
          pdfExtractedText: 'Notice for Multi-Tasking (Non-Technical) Staff and Havaldar (CBIC & CBN) Examination, 2026.',
          missingFields: [],
          confidenceScore: 98,
          isImportant: true
        }
      ]);
      console.log('[Seed] Initial verified recruitment notifications seeded.');
    }

    // 5. Seed Verified News Articles
    const newsCount = await NewsArticle.countDocuments();
    if (newsCount === 0) {
      await NewsArticle.create([
        {
          headline: 'Angalakuduru RBK Implements Real-Time Soil Testing and Bio-Fertilizer Subsidy Scheme',
          shortDescription: 'Farmers in Angalakuduru can now receive automated Soil Health Cards within 48 hours at the Village Secretariat, along with a 50% discount on organic fertilizers.',
          summaryEnglish: 'The Rythu Bharosa Kendra in Angalakuduru village has launched an express soil testing facility and subsidized bio-fertilizer supply drive for the upcoming Kharif and Rabi crop cycles. Local agricultural officers urged registered cultivators to update their e-crop registrations.',
          summaryTelugu: 'అంగలకుదురు రైతు భరోసా కేంద్రంలో సత్వర నేల పరీక్షా కేంద్రం మరియు 50 శాతం రాయితీతో సేంద్రీయ ఎరువుల పంపిణీ ప్రారంభమైంది. రైతులు తమ ఈ-క్రాప్ నమోదును సకాలంలో పూర్తి చేసుకోవాలని వ్యవసాయ అధికారులు కోరారు.',
          category: 'Agriculture',
          sourceWebsite: 'Angalakuduru Village & Rythu Bharosa Kendra Bulletin',
          originalArticleUrl: 'https://agri.ap.gov.in/angalakuduru/soil-health-2026',
          thumbnailUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
          geographicRelevance: {
            scope: 'Village',
            state: 'Andhra Pradesh',
            district: 'Guntur',
            mandal: 'Tenali',
            village: 'Angalakuduru'
          },
          publishedDate: new Date(),
          confidenceScore: 96,
          isImportant: true
        },
        {
          headline: 'Guntur District Collector Announces ₹18 Crore Modernization Works for Tenali Canal Irrigation',
          shortDescription: 'Tenders approved for canal desiltation, shutter renovations, and lining to ensure tail-end water security for 35,000 acres of paddy farmlands across Tenali and surrounding mandals.',
          summaryEnglish: 'District Collector chaired the irrigation advisory board meeting approving comprehensive desiltation and canal shutter modernization for Tenali canals, guaranteeing timely water release for tail-end rural ayacut farmers.',
          summaryTelugu: 'తెనాలి కాలువ ఆధునికీకరణ మరియు పూడికతీత పనుల కోసం గుంటూరు జిల్లా కలెక్టర్ రూ. 18 కోట్ల అభివృద్ధి పనులను ఆమోదించారు. దీనివల్ల 35 వేల ఎకరాల ఆయకట్టు రైతులకు చివరి భూముల వరకు సాగునీరు అందుతుంది.',
          category: 'District News',
          sourceWebsite: 'Guntur District Administration & Collectorate',
          originalArticleUrl: 'https://guntur.ap.gov.in/irrigation-tenali-2026',
          thumbnailUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80',
          geographicRelevance: {
            scope: 'District',
            state: 'Andhra Pradesh',
            district: 'Guntur',
            mandal: 'Tenali',
            village: 'Angalakuduru'
          },
          publishedDate: new Date(),
          confidenceScore: 94,
          isImportant: true
        }
      ]);
      console.log('[Seed] Initial verified news articles seeded.');
    }

    // 6. Seed In-App Notifications
    const notifCount = await InAppNotification.countDocuments();
    if (notifCount === 0) {
      await InAppNotification.create([
        {
          title: 'New Government Jobs: APPSC Group-II & Revenue Assistant Openings',
          body: 'APPSC Group-II online applications and Guntur District Collectorate Junior Assistant recruitment are now live.',
          category: 'Government Jobs',
          type: 'job',
          isImportant: true
        },
        {
          title: 'Agriculture Alert: 50% Fertilizer Subsidy at Angalakuduru RBK',
          body: 'Visit your local Rythu Bharosa Kendra for subsidized seeds and biometric authentication.',
          category: 'Agriculture',
          type: 'news',
          isImportant: true
        }
      ]);
      console.log('[Seed] Initial notifications seeded.');
    }

    console.log('[Seed] Database initialization complete.');
  } catch (err) {
    console.error(`[Seed] Error seeding database: ${err.message}`);
  }
}

// Run standalone if invoked directly
if (process.argv[1]?.endsWith('seedSources.js')) {
  seedDatabase().then(() => process.exit(0));
}
