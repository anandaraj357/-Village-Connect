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
    name: 'National Career Service (NCS) - Tamil Nadu Region',
    url: 'https://www.ncs.gov.in',
    category: 'job',
    subCategory: 'government',
    crawlerType: 'static_html',
    adapterKey: 'ncs_jobs',
    scheduleIntervalMinutes: 120,
    geographicScope: 'Tamil Nadu',
    district: 'Villupuram',
    mandal: 'Vanur',
    village: 'Nesal',
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
    district: 'Villupuram',
    enabled: true,
    trusted: true
  },
  {
    name: 'Tamil Nadu Public Service Commission (TNPSC)',
    url: 'https://www.tnpsc.gov.in',
    category: 'recruitment',
    subCategory: 'state_government',
    crawlerType: 'static_html',
    adapterKey: 'tnpsc_recruitment',
    scheduleIntervalMinutes: 120,
    geographicScope: 'Tamil Nadu',
    district: 'Villupuram',
    enabled: true,
    trusted: true
  },
  {
    name: 'SSC & Railway Recruitment Boards (Southern Region - Chennai)',
    url: 'https://sscsr.gov.in',
    category: 'recruitment',
    subCategory: 'central_government',
    crawlerType: 'static_html',
    adapterKey: 'ssc_upsc',
    scheduleIntervalMinutes: 120,
    geographicScope: 'National',
    district: 'Villupuram',
    enabled: true,
    trusted: true
  },
  {
    name: 'Villupuram District Administration & Collectorate',
    url: 'https://villupuram.nic.in',
    category: 'news',
    subCategory: 'district',
    crawlerType: 'static_html',
    adapterKey: 'district_news',
    scheduleIntervalMinutes: 45,
    geographicScope: 'District',
    district: 'Villupuram',
    mandal: 'Vanur',
    village: 'Nesal',
    enabled: true,
    trusted: true
  },
  {
    name: 'Nesal Village & Vanur Agriculture Extension Bulletin',
    url: 'https://agritech.tnau.ac.in',
    category: 'news',
    subCategory: 'agriculture',
    crawlerType: 'rss',
    adapterKey: 'village_news',
    scheduleIntervalMinutes: 45,
    geographicScope: 'Village',
    district: 'Villupuram',
    mandal: 'Vanur',
    village: 'Nesal',
    enabled: true,
    trusted: true
  }
];

export async function seedDatabase(forceClean = false) {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/our_village_crawler';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
    console.log('[Seed] Connected to MongoDB');

    if (forceClean) {
      await Promise.all([
        CrawlerSource.deleteMany({}),
        JobVacancy.deleteMany({}),
        RecruitmentNotification.deleteMany({}),
        NewsArticle.deleteMany({}),
        ContentApproval.deleteMany({}),
        CrawledRecord.deleteMany({}),
        InAppNotification.deleteMany({})
      ]);
      console.log('[Seed] Cleared legacy records for Tamil Nadu / Villupuram / Vanur / Nesal migration.');
    }

    // 1. Seed Sources
    for (const src of INITIAL_SOURCES) {
      const existing = await CrawlerSource.findOne({ name: src.name });
      if (!existing) {
        await CrawlerSource.create(src);
        console.log(`[Seed] Created source: ${src.name}`);
      } else {
        Object.assign(existing, src);
        await existing.save();
      }
    }

    // 2. Seed Default Admin User
    const existingAdmin = await User.findOne({ email: 'admin@ourvillage.tn.gov.in' });
    if (!existingAdmin) {
      await User.create({
        name: 'Villupuram District Administrator',
        email: 'admin@ourvillage.tn.gov.in',
        password: 'Admin@12345',
        role: 'admin',
        village: 'Nesal',
        mandal: 'Vanur',
        district: 'Villupuram',
        preferredLanguage: 'ta'
      });
      console.log('[Seed] Admin user created (admin@ourvillage.tn.gov.in / Admin@12345)');
    }

    // 3. Seed Verified Public Jobs
    const jobCount = await JobVacancy.countDocuments();
    if (jobCount === 0 || forceClean) {
      await JobVacancy.create([
        {
          jobTitle: 'Junior Assistant & Revenue Clerk Vacancies',
          organizationName: 'Villupuram District Collectorate & Vanur Taluk Office',
          jobCategory: 'Government',
          qualification: 'HSC (+2) / Any Degree with Government Technical Examination in Typewriting (Tamil & English)',
          requiredExperience: 'Freshers eligible',
          salary: '₹20,600 - ₹65,500 (Level 8)',
          vacanciesCount: 38,
          jobLocation: 'Villupuram & Vanur Taluk',
          district: 'Villupuram',
          applicationStartDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          applicationLastDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          officialNotificationUrl: 'https://villupuram.nic.in/recruitment/junior-assistants-2026',
          applicationUrl: 'https://villupuram.nic.in/apply',
          sourceWebsite: 'Villupuram District Administration & Collectorate',
          datePublished: new Date(),
          jobDescription: 'Recruitment of Junior Assistants and Revenue Clerks under Tamil Nadu Ministerial Service for Vanur Taluk and Villupuram divisional offices.',
          confidenceScore: 98,
          isImportant: true
        },
        {
          jobTitle: 'Field Agri-Coordinator & Drone Technology Assistant',
          organizationName: 'TNAU Krishi Vigyan Kendra (KVK) & Vanur Agriculture Extension',
          jobCategory: 'Local Job',
          qualification: 'Diploma in Agriculture / B.Sc (Agri) / Certified Drone Pilot',
          requiredExperience: '0 - 1 Year',
          salary: '₹23,500 / month consolidated',
          vacanciesCount: 12,
          jobLocation: 'Vanur Taluk (Nesal Cluster)',
          district: 'Villupuram',
          applicationStartDate: new Date(),
          applicationLastDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          officialNotificationUrl: 'https://agritech.tnau.ac.in/vanur-drone-spraying-2026',
          applicationUrl: 'https://agritech.tnau.ac.in',
          sourceWebsite: 'Nesal Village & Vanur Agriculture Extension Bulletin',
          datePublished: new Date(),
          jobDescription: 'Agricultural drone spraying supervision, soil health sampling and bio-fertilizer delivery operations for farmers in Nesal village and surrounding blocks.',
          confidenceScore: 96,
          isImportant: true
        },
        {
          jobTitle: 'Fullstack Web Developers & Mobile App Engineers (Hybrid / Remote)',
          organizationName: 'Tamil Nadu Technology Hub (iTNT) & Partner Software Firms',
          jobCategory: 'IT',
          qualification: 'B.E / B.Tech / MCA / B.Sc Computer Science',
          requiredExperience: '1 - 3 Years',
          salary: '₹5,50,000 - ₹11,00,000 / annum',
          vacanciesCount: 30,
          jobLocation: 'Chennai-Pondicherry Corridor / Remote (Work From Home)',
          district: 'Villupuram',
          applicationStartDate: new Date(),
          applicationLastDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          officialNotificationUrl: 'https://www.ncs.gov.in/it-openings-tn',
          applicationUrl: 'https://www.ncs.gov.in',
          sourceWebsite: 'National Career Service (NCS) - Tamil Nadu Region',
          datePublished: new Date(),
          jobDescription: 'Software engineering opportunities with rural talent incentives. Flexible remote work available for candidates based in Villupuram district.',
          confidenceScore: 93,
          isImportant: false
        }
      ]);
      console.log('[Seed] Verified Tamil Nadu / Villupuram jobs seeded.');
    }

    // 4. Seed Verified Recruitment Notifications
    const recCount = await RecruitmentNotification.countDocuments();
    if (recCount === 0 || forceClean) {
      await RecruitmentNotification.create([
        {
          recruitmentName: 'TNPSC Combined Civil Services Examination-IV (Group-IV & VAO 2026)',
          organization: 'Tamil Nadu Public Service Commission (TNPSC)',
          notificationNumber: 'TNPSC/NOTIF/04/2026',
          totalVacancies: 6244,
          postNames: ['Village Administrative Officer (VAO)', 'Junior Assistant', 'Bill Collector', 'Field Assistant', 'Draftsman'],
          eligibility: 'Must have passed S.S.L.C. (10th Standard) with eligibility for higher secondary admission',
          ageLimit: '18 to 37 Years (No upper age limit for SC/ST/MBC/BC candidates)',
          applicationFee: '₹100 (Exempted for reserved categories; One-Time Registration ₹150)',
          selectionProcess: 'Single Paper Written Examination (General Tamil + General Studies) and Certificate Verification',
          importantDates: {
            notificationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            applicationStartDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            applicationLastDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
            examDate: 'Written Exam: 12th July 2026'
          },
          officialPdfUrl: 'https://www.tnpsc.gov.in/Document/Notification/Group4_VAO_Notification_2026.pdf',
          officialApplicationLink: 'https://www.tnpscexams.in',
          sourceUrl: 'https://www.tnpsc.gov.in',
          pdfExtractedText: 'TAMIL NADU PUBLIC SERVICE COMMISSION: CHENNAI. NOTIFICATION NO. 04/2026. Group-IV Services & Village Administrative Officer recruitment across all Tamil Nadu districts.',
          missingFields: [],
          confidenceScore: 99,
          isImportant: true
        },
        {
          recruitmentName: 'TNPSC Combined Civil Services Examination-II (Group-II / IIA Services 2026)',
          organization: 'Tamil Nadu Public Service Commission (TNPSC)',
          notificationNumber: 'TNPSC/NOTIF/02/2026',
          totalVacancies: 2327,
          postNames: ['Municipal Commissioner Grade-II', 'Sub-Registrar Grade-II', 'Revenue Inspector', 'Assistant Section Officer'],
          eligibility: 'Bachelor Degree in any discipline from a recognized University in India',
          ageLimit: '18 to 34 Years (Age relaxations for SC/ST/BC/MBC)',
          applicationFee: '₹100 preliminary fee',
          selectionProcess: 'Preliminary Examination (Objective) and Main Written Examination (Descriptive)',
          importantDates: {
            notificationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            applicationStartDate: new Date(),
            applicationLastDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
            examDate: 'Preliminary CBT: September 2026'
          },
          officialPdfUrl: 'https://www.tnpsc.gov.in/Document/Notification/Group2_Services_2026.pdf',
          officialApplicationLink: 'https://www.tnpscexams.in',
          sourceUrl: 'https://www.tnpsc.gov.in',
          pdfExtractedText: 'Tamil Nadu Public Service Commission. Notification for Group II & Group IIA Services. Exam centers include Villupuram, Tindivanam and Chennai.',
          missingFields: [],
          confidenceScore: 98,
          isImportant: true
        }
      ]);
      console.log('[Seed] Verified TNPSC recruitment notifications seeded.');
    }

    // 5. Seed Verified News Articles
    const newsCount = await NewsArticle.countDocuments();
    if (newsCount === 0 || forceClean) {
      await NewsArticle.create([
        {
          headline: 'நேசல் கிராம பஞ்சாயத்தில் தார்ச்சாலை மற்றும் சோலார் தெருவிளக்குகள் அமைக்கும் பணி நிறைவு',
          shortDescription: 'வானூர் வட்டம் நேசல் கிராமத்தில் வேளாண் விளைபொருட்களை ஏற்றிச்செல்லும் சாலைகள் சீரமைக்கப்பட்டு 45 புதிய சோலார் விளக்குகள் நிறுவப்பட்டுள்ளன.',
          summaryEnglish: 'The Nesal Village Panchayat in Vanur Taluk has successfully completed the paving of key agricultural haul roads and installed 45 energy-efficient solar street lamps, enhancing village mobility and night safety for farmers and school students.',
          summaryTamil: 'வானூர் வட்டம் நேசல் கிராமத்தில் முக்கிய வேளாண் இணைப்புச் சாலைகள் தார்ச்சாலையாக தரம் உயர்த்தப்பட்டு, 45 உயர்தர சோலார் தெருவிளக்குகள் அமைக்கும் பணிகள் முழுமையாக நிறைவடைந்துள்ளன. இதனால் விவசாயிகள் மற்றும் பள்ளி மாணவ, மாணவியர் பெரிதும் பயனடைவர்.',
          summaryTelugu: 'வானூர் வட்டம் நேசல் கிராமத்தில் முக்கிய வேளாண் சாலைகள் தார்ச்சாலையாக அமைக்கப்பட்டுள்ளன.',
          category: 'Village News',
          sourceWebsite: 'Nesal Village & Vanur Agriculture Extension Bulletin',
          originalArticleUrl: 'https://villupuram.nic.in/nesal-panchayat-roads-2026',
          thumbnailUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
          geographicRelevance: {
            scope: 'Village',
            state: 'Tamil Nadu',
            district: 'Villupuram',
            mandal: 'Vanur',
            village: 'Nesal'
          },
          publishedDate: new Date(),
          confidenceScore: 97,
          isImportant: true
        },
        {
          headline: 'விழுப்புரம் மாவட்ட ஆட்சியர் அறிவிப்பு: வானூர் வட்டத்தில் பாசன வாய்க்கால்கள் தூர்வார ரூ.14 கோடி ஒதுக்கீடு',
          shortDescription: 'வானூர் மற்றும் சுற்றுவட்டார பாசன நிலங்களுக்கு தண்ணீர் தடையின்றி சென்றடையும் வகையில் ரூ.14 கோடியில் தூர்வாரும் பணிகள் தொடங்கப்பட உள்ளன.',
          summaryEnglish: 'Villupuram District Collector announced an administrative sanction of ₹14 Crores for desiltation, sluice repairs, and canal modernization across Vanur Taluk, securing tail-end irrigation water for over 22,000 acres of paddy cultivation.',
          summaryTamil: 'விழுப்புரம் மாவட்ட ஆட்சியர் தலைமையில் நடைபெற்ற பாசனக் கூட்டத்தில், வானூர் வட்டாரத்தில் உள்ள 22,000 ஏக்கர் விளைநிலங்களுக்கு கடைமடை வரை பாசன நீர் சென்றடையும் வகையில் ரூ. 14 கோடி மதிப்பிலான வாய்க்கால் தூர்வாரும் பணிகள் மற்றும் மதகு சீரமைப்பு பணிகளுக்கு ஒப்புதல் வழங்கப்பட்டது.',
          summaryTelugu: 'விழுப்புரம் மாவட்ட ஆட்சியர் பாசனக் கால்வாய் தூர்வார ரூ. 14 கோடி ஒதுக்கீடு செய்தார்.',
          category: 'District News',
          sourceWebsite: 'Villupuram District Administration & Collectorate',
          originalArticleUrl: 'https://villupuram.nic.in/press-release/irrigation-vanur-2026',
          thumbnailUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80',
          geographicRelevance: {
            scope: 'District',
            state: 'Tamil Nadu',
            district: 'Villupuram',
            mandal: 'Vanur',
            village: 'Nesal'
          },
          publishedDate: new Date(),
          confidenceScore: 96,
          isImportant: true
        },
        {
          headline: 'வானூர் வட்டாரத்தில் உளுந்து மற்றும் நெல் சாகுபடிக்கு 50% மானியத்தில் சான்று விதைகள் விநியோகம்',
          shortDescription: 'நேசல் கிராம விவசாயிகளுக்கு உழவர் உற்பத்தியாளர் சங்கம் மற்றும் வேளாண் விரிவாக்க மையம் மூலம் 50 சதவீத அரசு மானியத்தில் தரமான விதைகள் வழங்கப்படுகின்றன.',
          summaryEnglish: 'Tamil Nadu Agriculture and Farmers Welfare Department is distributing certified high-yield paddy and blackgram seeds along with bio-fertilizers at a 50% subsidy to registered farmers in Nesal Village, Vanur block.',
          summaryTamil: 'தமிழ்நாடு வேளாண்மை - உழவர் நலத்துறை சார்பில், வானூர் வட்டார வேளாண்மை விரிவாக்க மையம் மூலமாக நேசல் கிராம விவசாயிகளுக்கு 50% மானிய விலையில் சான்று பெற்ற உயர்ரக நெல் மற்றும் பயறு விதைகள் விநியோகம் செய்யப்படுகின்றன.',
          summaryTelugu: 'விவசாயிகளுக்கு 50 சதவீத மானியத்தில் சான்று விதைகள் விநியோகம்.',
          category: 'Agriculture',
          sourceWebsite: 'Nesal Village & Vanur Agriculture Extension Bulletin',
          originalArticleUrl: 'https://agritech.tnau.ac.in/vanur-seeds-distribution-2026',
          thumbnailUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
          geographicRelevance: {
            scope: 'Village',
            state: 'Tamil Nadu',
            district: 'Villupuram',
            mandal: 'Vanur',
            village: 'Nesal'
          },
          publishedDate: new Date(),
          confidenceScore: 95,
          isImportant: true
        }
      ]);
      console.log('[Seed] Verified Tamil Nadu news articles seeded.');
    }

    // 6. Seed In-App Notifications
    const notifCount = await InAppNotification.countDocuments();
    if (notifCount === 0 || forceClean) {
      await InAppNotification.create([
        {
          title: 'புதிய தமிழ்நாடு அரசுப் பணி: TNPSC குரூப்-4 & கிராம நிர்வாக அலுவலர் (VAO) அறிவிப்பு',
          body: '6,244 பணியிடங்களுக்கான TNPSC குரூப்-4 ஆன்லைன் விண்ணப்பப் பதிவு தொடங்கியது. நேசல் மற்றும் வானூர் பகுதி விண்ணப்பதாரர்கள் பயன்பெறலாம்.',
          category: 'Government Jobs',
          type: 'recruitment',
          isImportant: true
        },
        {
          title: 'வேளாண்மை விழிப்பூட்டல்: நேசல் கிராம விவசாயிகளுக்கு 50% மானியத்தில் சான்று விதைகள்',
          body: 'வானூர் வட்டார வேளாண்மை அலுவலகம் மூலம் 50% மானியத்தில் நெல் மற்றும் உளுந்து விதைகள் பெற விவசாயிகள் உடனடியாக அணுகவும்.',
          category: 'Agriculture',
          type: 'news',
          isImportant: true
        }
      ]);
      console.log('[Seed] Tamil Nadu in-app notifications seeded.');
    }

    console.log('[Seed] Database initialization complete for Tamil Nadu, Villupuram, Vanur, Nesal.');
  } catch (err) {
    console.error(`[Seed] Error seeding database: ${err.message}`);
  }
}

if (process.argv[1]?.endsWith('seedSources.js')) {
  const forceClean = process.argv.includes('--clean');
  seedDatabase(forceClean).then(() => process.exit(0));
}
