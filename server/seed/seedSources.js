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
import HeritageArchive from '../models/HeritageArchive.js';
import TransportSchedule from '../models/TransportSchedule.js';

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

    // 3. Seed Verified Public Jobs across All Tamil Nadu
    const jobCount = await JobVacancy.countDocuments();
    if (jobCount <= 3 || forceClean) {
      if (forceClean) await JobVacancy.deleteMany({});
      await JobVacancy.create([
        {
          jobTitle: 'Junior Assistant & Revenue Clerk Vacancies',
          organizationName: 'Villupuram District Collectorate & Vanur Taluk Office',
          jobCategory: 'Government',
          jobType: 'Full-Time',
          qualification: 'HSC (+2) / Any Degree with Government Technical Examination in Typewriting (Tamil & English)',
          requiredExperience: 'Freshers eligible',
          salary: '₹20,600 - ₹65,500 (Level 8)',
          vacanciesCount: 38,
          jobLocation: 'Villupuram & Vanur Taluk',
          district: 'Villupuram',
          state: 'Tamil Nadu',
          applicationStartDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          applicationLastDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          officialNotificationUrl: 'https://villupuram.nic.in/recruitment/junior-assistants-2026',
          applicationUrl: 'https://villupuram.nic.in/apply',
          sourceWebsite: 'Villupuram District Administration & Collectorate',
          datePublished: new Date(),
          jobDescription: 'Recruitment of Junior Assistants and Revenue Clerks under Tamil Nadu Ministerial Service for Vanur Taluk and Villupuram divisional offices.',
          confidenceScore: 98,
          isImportant: true,
          status: 'approved',
          howToApply: 'Apply online through District Portal or submit at Vanur Taluk Office'
        },
        {
          jobTitle: 'Field Agri-Coordinator & Drone Technology Assistant',
          organizationName: 'TNAU Krishi Vigyan Kendra (KVK) & Vanur Agriculture Extension',
          jobCategory: 'Agriculture',
          jobType: 'Full-Time',
          qualification: 'Diploma in Agriculture / B.Sc (Agri) / Certified Drone Pilot',
          requiredExperience: '0 - 1 Year',
          salary: '₹23,500 / month consolidated',
          vacanciesCount: 12,
          jobLocation: 'Vanur Taluk (Nesal Cluster)',
          district: 'Villupuram',
          state: 'Tamil Nadu',
          applicationStartDate: new Date(),
          applicationLastDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          officialNotificationUrl: 'https://agritech.tnau.ac.in/vanur-drone-spraying-2026',
          applicationUrl: 'https://agritech.tnau.ac.in',
          sourceWebsite: 'Nesal Village & Vanur Agriculture Extension Bulletin',
          datePublished: new Date(),
          jobDescription: 'Agricultural drone spraying supervision, soil health sampling and bio-fertilizer delivery operations for farmers in Nesal village and surrounding blocks.',
          confidenceScore: 96,
          isImportant: true,
          status: 'approved',
          contactPhone: '9443212345',
          contactPerson: 'KVK Agriculture Officer, Vanur'
        },
        {
          jobTitle: 'Fullstack Web Developers & Mobile App Engineers (Hybrid / Remote)',
          organizationName: 'Tamil Nadu Technology Hub (iTNT) & Partner Software Firms',
          jobCategory: 'IT',
          jobType: 'Full-Time',
          qualification: 'B.E / B.Tech / MCA / B.Sc Computer Science',
          requiredExperience: '1 - 3 Years',
          salary: '₹5,50,000 - ₹11,00,000 / annum',
          vacanciesCount: 30,
          jobLocation: 'Chennai & Coimbatore (Hybrid / WFH Options)',
          district: 'Chennai',
          state: 'Tamil Nadu',
          applicationStartDate: new Date(),
          applicationLastDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          officialNotificationUrl: 'https://www.ncs.gov.in/it-openings-tn',
          applicationUrl: 'https://www.ncs.gov.in',
          sourceWebsite: 'National Career Service (NCS) - Tamil Nadu Region',
          datePublished: new Date(),
          jobDescription: 'Software engineering opportunities with rural talent incentives. Flexible remote work available for candidates based across all Tamil Nadu districts.',
          confidenceScore: 93,
          isImportant: false,
          status: 'approved'
        },
        {
          jobTitle: 'EV Battery & Automotive Assembly Technicians',
          organizationName: 'Tamil Nadu Industrial Guidance Bureau & Tata Electronics / Hyundai Mega Factory',
          jobCategory: 'Manufacturing',
          jobType: 'Full-Time',
          qualification: 'ITI (Electrician/Fitter/Turner) / Diploma in Mechanical or EEE / 12th Pass',
          requiredExperience: 'Freshers welcome',
          salary: '₹19,500 - ₹26,000 / month + Free Canteen & Bus Transport',
          vacanciesCount: 150,
          jobLocation: 'Sriperumbudur & Oragadam Industrial Corridors',
          district: 'Kanchipuram',
          state: 'Tamil Nadu',
          applicationStartDate: new Date(),
          applicationLastDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          officialNotificationUrl: 'https://www.sipcot.tn.gov.in/careers',
          applicationUrl: 'https://www.sipcot.tn.gov.in',
          sourceWebsite: 'SIPCOT Industrial Park Recruitment',
          datePublished: new Date(),
          jobDescription: 'Precision mechanical assembly, testing of electronic components, and EV powertrain manufacturing. Free food and transport provided across Kanchipuram and Chengalpattu.',
          confidenceScore: 97,
          isImportant: true,
          status: 'approved'
        },
        {
          jobTitle: 'Garment Production Supervisors & Quality Checkers',
          organizationName: 'Tiruppur Export Knitwear Association (TEKMA) & Partner Apparel Units',
          jobCategory: 'Manufacturing',
          jobType: 'Full-Time',
          qualification: 'Diploma in Textile / Any Degree / 10th or 12th Pass',
          requiredExperience: '0 - 2 Years',
          salary: '₹17,000 - ₹24,000 / month + Overtime & Accommodation',
          vacanciesCount: 85,
          jobLocation: 'Tiruppur & Erode Textile Zones',
          district: 'Tiruppur',
          state: 'Tamil Nadu',
          applicationStartDate: new Date(),
          applicationLastDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
          officialNotificationUrl: 'https://tiruppur.nic.in/apparel-drive',
          applicationUrl: 'https://tiruppur.nic.in',
          sourceWebsite: 'Tiruppur District Employment Exchange',
          datePublished: new Date(),
          jobDescription: 'Monitoring knitwear stitching, fabric inspection, and international export packing standards. Safe dormitory accommodation provided for rural candidates.',
          confidenceScore: 94,
          isImportant: false,
          status: 'approved',
          contactPhone: '9842109876'
        },
        {
          jobTitle: 'Staff Nurses & Dialysis Technicians',
          organizationName: 'Kauvery & Apollo Super Specialty Hospitals Network',
          jobCategory: 'Healthcare',
          jobType: 'Full-Time',
          qualification: 'B.Sc Nursing / GNM Diploma / Dialysis Technology Certificate',
          requiredExperience: 'Freshers or 1+ Year experience',
          salary: '₹22,000 - ₹35,000 / month',
          vacanciesCount: 60,
          jobLocation: 'Trichy, Madurai & Chennai Hospitals',
          district: 'Tiruchirappalli',
          state: 'Tamil Nadu',
          applicationStartDate: new Date(),
          applicationLastDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          officialNotificationUrl: 'https://kauveryhospital.com/careers',
          applicationUrl: 'https://kauveryhospital.com',
          sourceWebsite: 'Tamil Nadu Healthcare Consortium',
          datePublished: new Date(),
          jobDescription: 'In-patient patient care, ICU monitoring, and emergency triage operations. Immediate placement with subsidized hostel facilities.',
          confidenceScore: 96,
          isImportant: true,
          status: 'approved',
          contactPhone: '0431-4077777'
        },
        {
          jobTitle: 'Field Loan Officers & Customer Service Executives',
          organizationName: 'Equitas Small Finance Bank & Muthoot Microfinance',
          jobCategory: 'Banking',
          jobType: 'Full-Time',
          qualification: 'Any Degree / 12th Pass with valid Two-Wheeler Driving License',
          requiredExperience: 'Freshers eligible',
          salary: '₹18,000 - ₹27,000 / month + Fuel Allowance & Incentives',
          vacanciesCount: 45,
          jobLocation: 'Salem, Villupuram, Cuddalore & Dindigul Branches',
          district: 'Salem',
          state: 'Tamil Nadu',
          applicationStartDate: new Date(),
          applicationLastDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
          officialNotificationUrl: 'https://equitasbank.com/careers',
          applicationUrl: 'https://equitasbank.com',
          sourceWebsite: 'Tamil Nadu Rural Banking Forum',
          datePublished: new Date(),
          jobDescription: 'Assisting rural self-help groups (SHG), farmers, and small traders with micro-credit loans, KYC collection, and doorstep banking assistance.',
          confidenceScore: 95,
          isImportant: false,
          status: 'approved',
          contactPhone: '9843511223'
        },
        {
          jobTitle: 'Solar Rooftop & Farm Substation Maintenance Technicians',
          organizationName: 'Tamil Nadu Green Energy Development Corporation (TNGEDCO Partners)',
          jobCategory: 'Skilled Trade',
          jobType: 'Full-Time',
          qualification: 'ITI Electrical / Wireman / Diploma in EEE',
          requiredExperience: '0 - 1 Year',
          salary: '₹18,500 - ₹25,000 / month',
          vacanciesCount: 50,
          jobLocation: 'Virudhunagar, Tirunelveli & Thoothukudi Solar Parks',
          district: 'Tirunelveli',
          state: 'Tamil Nadu',
          applicationStartDate: new Date(),
          applicationLastDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
          officialNotificationUrl: 'https://tnerc.gov.in/solar-careers',
          applicationUrl: 'https://tnerc.gov.in',
          sourceWebsite: 'Tamil Nadu Renewable Energy Agency',
          datePublished: new Date(),
          jobDescription: 'Solar panel array cabling, inverter monitoring, grid synchronization, and daily farm maintenance in Southern Tamil Nadu solar corridors.',
          confidenceScore: 95,
          isImportant: true,
          status: 'approved'
        },
        {
          jobTitle: 'Heavy Vehicle Bus Drivers & Automotive Mechanics',
          organizationName: 'Tamil Nadu State Transport Corporation (TNSTC - Villupuram & Cuddalore Divisions)',
          jobCategory: 'Logistics',
          jobType: 'Full-Time',
          qualification: '8th / 10th Pass with Heavy Transport Vehicle (HTV) License & PSV Badge',
          requiredExperience: 'Minimum 18 Months Heavy Vehicle Driving',
          salary: '₹19,000 - ₹38,000 / month',
          vacanciesCount: 95,
          jobLocation: 'Villupuram, Cuddalore, Tindivanam & Kanchipuram Depots',
          district: 'Cuddalore',
          state: 'Tamil Nadu',
          applicationStartDate: new Date(),
          applicationLastDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
          officialNotificationUrl: 'https://aris.tn.gov.in/tnstc',
          applicationUrl: 'https://aris.tn.gov.in',
          sourceWebsite: 'TNSTC Official Recruitment Board',
          datePublished: new Date(),
          jobDescription: 'Operation of mofussil and town bus routes across Cuddalore and Villupuram districts. Daily maintenance and periodic safety inspections.',
          confidenceScore: 98,
          isImportant: true,
          status: 'approved'
        },
        {
          jobTitle: 'Supermarket Departmental In-Charge & Cashier Associates',
          organizationName: 'Reliance Retail & D-Mart Hypermarkets Tamil Nadu',
          jobCategory: 'Retail',
          jobType: 'Full-Time',
          qualification: '10th / 12th Pass / Any Degree',
          requiredExperience: 'Freshers Welcome',
          salary: '₹15,000 - ₹21,000 / month + ESI, PF & Performance Bonus',
          vacanciesCount: 75,
          jobLocation: 'Madurai, Trichy, Coimbatore & Chennai Stores',
          district: 'Madurai',
          state: 'Tamil Nadu',
          applicationStartDate: new Date(),
          applicationLastDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
          officialNotificationUrl: 'https://relianceretail.com/careers',
          applicationUrl: 'https://relianceretail.com',
          sourceWebsite: 'Tamil Nadu Retail Career Hub',
          datePublished: new Date(),
          jobDescription: 'Customer assistance, billing counter management, grocery inventory audits, and display merchandising in major retail outlets.',
          confidenceScore: 94,
          isImportant: false,
          status: 'approved',
          contactPhone: '0452-2588888'
        },
        {
          jobTitle: 'Tamil Voice Support & Rural Helpdesk Executives (Work From Home)',
          organizationName: 'Tech Mahindra & BPO Regional Outreach Unit',
          jobCategory: 'Work From Home',
          jobType: 'Full-Time',
          qualification: '12th Pass / Any Graduate with fluent Tamil & basic English',
          requiredExperience: 'Freshers eligible',
          salary: '₹16,000 - ₹23,000 / month + Home Internet Allowance',
          vacanciesCount: 100,
          jobLocation: 'Work From Home (Any District in Tamil Nadu)',
          district: 'All Tamil Nadu',
          state: 'Tamil Nadu',
          applicationStartDate: new Date(),
          applicationLastDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          officialNotificationUrl: 'https://techmahindra.com/bpo-tn',
          applicationUrl: 'https://techmahindra.com',
          sourceWebsite: 'TN Career & Remote Jobs Portal',
          datePublished: new Date(),
          jobDescription: 'Answering customer queries regarding telecommunications, government citizen portals, and banking services over inbound Tamil helpline.',
          confidenceScore: 93,
          isImportant: false,
          status: 'approved'
        },
        {
          jobTitle: 'High School Mathematics & Science Teachers',
          organizationName: 'Tamil Nadu Matriculation & CBSE Affiliated Schools Council',
          jobCategory: 'Education',
          jobType: 'Full-Time',
          qualification: 'B.Sc / M.Sc with B.Ed in Mathematics, Physics or Chemistry',
          requiredExperience: '0 - 3 Years',
          salary: '₹20,000 - ₹32,000 / month + Staff Quarters in select schools',
          vacanciesCount: 35,
          jobLocation: 'Villupuram, Thanjavur & Kanchipuram Towns',
          district: 'Thanjavur',
          state: 'Tamil Nadu',
          applicationStartDate: new Date(),
          applicationLastDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          officialNotificationUrl: 'https://thanjavur.nic.in/education-drive',
          applicationUrl: 'https://thanjavur.nic.in',
          sourceWebsite: 'Tamil Nadu School Education Bulletin',
          datePublished: new Date(),
          jobDescription: 'Teaching curriculum for 9th and 10th standard matriculation/CBSE boards, conducting laboratory experiments, and student mentoring.',
          confidenceScore: 95,
          isImportant: false,
          status: 'approved',
          contactPhone: '9443388776'
        }
      ]);
      console.log('[Seed] Comprehensive verified jobs across Tamil Nadu seeded.');
    }

    // 4. Seed Verified Recruitment Notifications across All Tamil Nadu
    const recCount = await RecruitmentNotification.countDocuments();
    if (recCount <= 2 || forceClean) {
      if (forceClean) await RecruitmentNotification.deleteMany({});
      await RecruitmentNotification.create([
        {
          recruitmentName: 'TNPSC Combined Civil Services Examination-IV (Group-IV & VAO 2026)',
          organization: 'Tamil Nadu Public Service Commission (TNPSC)',
          notificationNumber: 'TNPSC/NOTIF/04/2026',
          district: 'All Tamil Nadu',
          state: 'Tamil Nadu',
          department: 'Revenue, Survey & Ministerial Services',
          category: 'Government',
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
          isImportant: true,
          status: 'approved'
        },
        {
          recruitmentName: 'TNPSC Combined Civil Services Examination-II (Group-II / IIA Services 2026)',
          organization: 'Tamil Nadu Public Service Commission (TNPSC)',
          notificationNumber: 'TNPSC/NOTIF/02/2026',
          district: 'All Tamil Nadu',
          state: 'Tamil Nadu',
          department: 'Executive & Subordinate Services',
          category: 'Government',
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
          pdfExtractedText: 'Tamil Nadu Public Service Commission. Notification for Group II & Group IIA Services. Exam centers include Villupuram, Tindivanam, Chennai, Coimbatore and Madurai.',
          missingFields: [],
          confidenceScore: 98,
          isImportant: true,
          status: 'approved'
        },
        {
          recruitmentName: 'TNUSRB Sub-Inspectors of Police (Taluk, AR & TSP) Recruitment 2026',
          organization: 'Tamil Nadu Uniformed Services Recruitment Board (TNUSRB)',
          notificationNumber: 'TNUSRB/SI/NOTIF/01/2026',
          district: 'All Tamil Nadu',
          state: 'Tamil Nadu',
          department: 'Tamil Nadu Police Department',
          category: 'Government',
          totalVacancies: 1078,
          postNames: ['Sub-Inspector of Police (Taluk)', 'Sub-Inspector (Armed Reserve)', 'Sub-Inspector (TSP)'],
          eligibility: 'Any Bachelor Degree from a recognized University + Physical Fitness Standards',
          ageLimit: '20 to 30 Years (Relaxations for BC/MBC/SC/ST as per rules)',
          applicationFee: '₹500 for Open Quota candidates',
          selectionProcess: 'Written Test (General Knowledge & Psychology) + Physical Endurance Test (PET) + Viva-Voce',
          importantDates: {
            notificationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            applicationStartDate: new Date(),
            applicationLastDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
            examDate: 'Written Exam: August 2026'
          },
          officialPdfUrl: 'https://www.tnusrb.tn.gov.in/Document/Notification/SI_Recruitment_2026.pdf',
          officialApplicationLink: 'https://www.tnusrb.tn.gov.in',
          sourceUrl: 'https://www.tnusrb.tn.gov.in',
          pdfExtractedText: 'Tamil Nadu Uniformed Services Recruitment Board SI Notification 2026. Posts available across all 38 police districts and commissionrates.',
          missingFields: [],
          confidenceScore: 99,
          isImportant: true,
          status: 'approved'
        },
        {
          recruitmentName: 'Medical Services Recruitment Board (MRB) Staff Nurses & Pharmacists 2026',
          organization: 'Medical Services Recruitment Board (MRB) Tamil Nadu',
          notificationNumber: 'MRB/NURSE-PHARM/03/2026',
          district: 'All Tamil Nadu',
          state: 'Tamil Nadu',
          department: 'Health and Family Welfare Department',
          category: 'Government',
          totalVacancies: 2250,
          postNames: ['Staff Nurse (Special Grade)', 'Government Hospital Pharmacist'],
          eligibility: 'Diploma in General Nursing and Midwifery (GNM) or B.Sc (Nursing) / D.Pharm / B.Pharm with TN Nursing/Pharmacy Council Registration',
          ageLimit: '18 to 35 Years (No upper age limit for reserved categories)',
          applicationFee: '₹600 (₹300 for SC/ST/Differently Abled)',
          selectionProcess: 'Computer Based Test (CBT) and Document Verification',
          importantDates: {
            notificationDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            applicationStartDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            applicationLastDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            examDate: 'CBT Examination: June 2026'
          },
          officialPdfUrl: 'https://www.mrb.tn.gov.in/Document/Notification/MRB_Staff_Nurse_2026.pdf',
          officialApplicationLink: 'https://www.mrb.tn.gov.in',
          sourceUrl: 'https://www.mrb.tn.gov.in',
          pdfExtractedText: 'Medical Services Recruitment Board. Direct recruitment for Staff Nurse and Pharmacist vacancies in Govt Medical College Hospitals and Primary Health Centres in Villupuram, Chennai, Madurai and all TN districts.',
          missingFields: [],
          confidenceScore: 98,
          isImportant: true,
          status: 'approved'
        },
        {
          recruitmentName: 'Teachers Recruitment Board (TRB) Post Graduate Assistants & Physical Directors 2026',
          organization: 'Teachers Recruitment Board (TRB) Tamil Nadu',
          notificationNumber: 'TRB/PG-ASST/02/2026',
          district: 'All Tamil Nadu',
          state: 'Tamil Nadu',
          department: 'School Education & Higher Education Department',
          category: 'Government',
          totalVacancies: 2780,
          postNames: ['Post Graduate Assistant (Tamil/English/Maths/Physics/Chemistry)', 'Physical Director Grade-I'],
          eligibility: 'Post Graduate Degree with at least 50% marks in relevant subject + B.Ed from recognized University',
          ageLimit: 'Up to 53 Years for general category (58 Years for reserved)',
          applicationFee: '₹500 (₹250 for SC/ST/SCA)',
          selectionProcess: 'Computer Based Examination (Subject Knowledge, Educational Methodology & GK)',
          importantDates: {
            notificationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            applicationStartDate: new Date(),
            applicationLastDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
            examDate: 'Written Exam: October 2026'
          },
          officialPdfUrl: 'https://trb.tn.gov.in/Document/Notification/TRB_PG_Assistant_2026.pdf',
          officialApplicationLink: 'https://trb.tn.gov.in',
          sourceUrl: 'https://trb.tn.gov.in',
          pdfExtractedText: 'Teachers Recruitment Board Chennai. Direct recruitment for PG Assistants in Government Higher Secondary Schools across all districts of Tamil Nadu.',
          missingFields: [],
          confidenceScore: 97,
          isImportant: true,
          status: 'approved'
        },
        {
          recruitmentName: 'TANGEDCO (TNEB) Assistant Engineers, Wiremen & Field Assistants 2026',
          organization: 'Tamil Nadu Generation and Distribution Corporation (TANGEDCO)',
          notificationNumber: 'TNEB/DIR-REC/01/2026',
          district: 'All Tamil Nadu',
          state: 'Tamil Nadu',
          department: 'Power & Energy Distribution',
          category: 'Government',
          totalVacancies: 1500,
          postNames: ['Assistant Engineer (Electrical/Civil)', 'Field Assistant (Trainee)', 'Junior Wireman'],
          eligibility: 'B.E (EEE/ECE/Civil) for AE; ITI Electrician/Wireman or National Trade Certificate for Field Assistant',
          ageLimit: '18 to 32 Years (Age concessions as per TN Government rules)',
          applicationFee: '₹500 (₹250 for SC/ST)',
          selectionProcess: 'State-wide Online Examination and Physical Pole Climbing Test for Field Staff',
          importantDates: {
            notificationDate: new Date(),
            applicationStartDate: new Date(),
            applicationLastDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            examDate: 'Online Exam: September 2026'
          },
          officialPdfUrl: 'https://www.tangedco.gov.in/Document/Notification/TNEB_Recruitment_2026.pdf',
          officialApplicationLink: 'https://www.tangedco.gov.in',
          sourceUrl: 'https://www.tangedco.gov.in',
          pdfExtractedText: 'TANGEDCO Direct Recruitment across all distribution circles including Villupuram, Cuddalore, Vellore, Chennai, Madurai and Coimbatore.',
          missingFields: [],
          confidenceScore: 97,
          isImportant: true,
          status: 'approved'
        },
        {
          recruitmentName: 'Madras High Court & District Judicial Courts - Office Assistants & Typists 2026',
          organization: 'Judicial Department & Madras High Court Recruitment Cell',
          notificationNumber: 'MHC/DIST-COURT/05/2026',
          district: 'All Tamil Nadu',
          state: 'Tamil Nadu',
          department: 'Judicial Subordinate Services',
          category: 'Government',
          totalVacancies: 1200,
          postNames: ['Office Assistant', 'Typist / Copyist', 'Bailiff', 'Driver', 'Night Watchman'],
          eligibility: '8th Pass for Office Assistant; 10th Pass with Typewriting Senior for Typist posts',
          ageLimit: '18 to 37 Years (SC/ST/MBC/BC as per judicial service norms)',
          applicationFee: '₹500 (Exempted for SC/ST/Differently Abled)',
          selectionProcess: 'Common Written Examination followed by Skill Test and Oral Interview',
          importantDates: {
            notificationDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
            applicationStartDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            applicationLastDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
            examDate: 'Written Test: July 2026'
          },
          officialPdfUrl: 'https://www.mhc.tn.gov.in/Document/Notification/MHC_District_Courts_2026.pdf',
          officialApplicationLink: 'https://www.mhc.tn.gov.in',
          sourceUrl: 'https://www.mhc.tn.gov.in',
          pdfExtractedText: 'Recruitment for subordinate court vacancies in all 38 judicial districts of Tamil Nadu including Villupuram, Kanchipuram, Madurai and Salem.',
          missingFields: [],
          confidenceScore: 98,
          isImportant: true,
          status: 'approved'
        },
        {
          recruitmentName: 'Southern Railway (SR Chennai Division) Act Apprentice & Technical Cadre 2026',
          organization: 'Railway Recruitment Cell (RRC) - Southern Railway Chennai',
          notificationNumber: 'RRC/SR/APPRENTICE/2026',
          district: 'All Tamil Nadu',
          state: 'Tamil Nadu',
          department: 'Ministry of Railways (Southern Railway)',
          category: 'Government',
          totalVacancies: 2860,
          postNames: ['Fitter Apprentice', 'Electrician Apprentice', 'Welder Apprentice', 'Diesel Mechanic', 'Carriage & Wagon Technician'],
          eligibility: '10th Class with minimum 50% marks + National Trade Certificate (NCVT/SCVT ITI)',
          ageLimit: '15 to 24 Years (Age relaxations: 5 yrs SC/ST, 3 yrs OBC)',
          applicationFee: '₹100 (No fee for SC/ST/PWD/Women candidates)',
          selectionProcess: 'Merit list prepared on marks scored in Matriculation + ITI trade examination (No Written Exam)',
          importantDates: {
            notificationDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            applicationStartDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            applicationLastDate: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000),
            examDate: 'Merit List Publication: August 2026'
          },
          officialPdfUrl: 'https://www.rrcmas.in/Document/Notification/RRC_SR_Apprentice_2026.pdf',
          officialApplicationLink: 'https://www.rrcmas.in',
          sourceUrl: 'https://www.rrcmas.in',
          pdfExtractedText: 'Southern Railway RRC Chennai. Technical trade apprenticeships across Chennai, Tiruchirappalli, Madurai, Salem and Podanur railway workshops.',
          missingFields: [],
          confidenceScore: 99,
          isImportant: true,
          status: 'approved'
        }
      ]);
      console.log('[Seed] Comprehensive verified recruitment notifications across Tamil Nadu seeded.');
    }

    // 5. Seed Verified News Articles
    const newsCount = await NewsArticle.countDocuments();
    if (newsCount === 0 || forceClean) {
      await NewsArticle.create([
        {
          headline: 'நெசல் கிராம பஞ்சாயத்தில் தார்ச்சாலை மற்றும் சோலார் தெருவிளக்குகள் அமைக்கும் பணி நிறைவு',
          shortDescription: 'வானூர் வட்டம் நெசல் கிராமத்தில் வேளாண் விளைபொருட்களை ஏற்றிச்செல்லும் சாலைகள் சீரமைக்கப்பட்டு 45 புதிய சோலார் விளக்குகள் நிறுவப்பட்டுள்ளன.',
          summaryEnglish: 'The Nesal Village Panchayat in Vanur Taluk has successfully completed the paving of key agricultural haul roads and installed 45 energy-efficient solar street lamps, enhancing village mobility and night safety for farmers and school students.',
          summaryTamil: 'வானூர் வட்டம் நெசல் கிராமத்தில் முக்கிய வேளாண் இணைப்புச் சாலைகள் தார்ச்சாலையாக தரம் உயர்த்தப்பட்டு, 45 உயர்தர சோலார் தெருவிளக்குகள் அமைக்கும் பணிகள் முழுமையாக நிறைவடைந்துள்ளன. இதனால் விவசாயிகள் மற்றும் பள்ளி மாணவ, மாணவியர் பெரிதும் பயனடைவர்.',
          summaryTelugu: 'வானூர் வட்டம் நெசல் கிராமத்தில் முக்கிய வேளாண் சாலைகள் தார்ச்சாலையாக அமைக்கப்பட்டுள்ளன.',
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
          shortDescription: 'நெசல் கிராம விவசாயிகளுக்கு உழவர் உற்பத்தியாளர் சங்கம் மற்றும் வேளாண் விரிவாக்க மையம் மூலம் 50 சதவீத அரசு மானியத்தில் தரமான விதைகள் வழங்கப்படுகின்றன.',
          summaryEnglish: 'Tamil Nadu Agriculture and Farmers Welfare Department is distributing certified high-yield paddy and blackgram seeds along with bio-fertilizers at a 50% subsidy to registered farmers in Nesal Village, Vanur block.',
          summaryTamil: 'தமிழ்நாடு வேளாண்மை - உழவர் நலத்துறை சார்பில், வானூர் வட்டார வேளாண்மை விரிவாக்க மையம் மூலமாக நெசல் கிராம விவசாயிகளுக்கு 50% மானிய விலையில் சான்று பெற்ற உயர்ரக நெல் மற்றும் பயறு விதைகள் விநியோகம் செய்யப்படுகின்றன.',
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
          body: '6,244 பணியிடங்களுக்கான TNPSC குரூப்-4 ஆன்லைன் விண்ணப்பப் பதிவு தொடங்கியது. நெசல் மற்றும் வானூர் பகுதி விண்ணப்பதாரர்கள் பயன்பெறலாம்.',
          category: 'Government Jobs',
          type: 'recruitment',
          isImportant: true
        },
        {
          title: 'வேளாண்மை விழிப்பூட்டல்: நெசல் கிராம விவசாயிகளுக்கு 50% மானியத்தில் சான்று விதைகள்',
          body: 'வானூர் வட்டார வேளாண்மை அலுவலகம் மூலம் 50% மானியத்தில் நெல் மற்றும் உளுந்து விதைகள் பெற விவசாயிகள் உடனடியாக அணுகவும்.',
          category: 'Agriculture',
          type: 'news',
          isImportant: true
        }
      ]);
      console.log('[Seed] Tamil Nadu in-app notifications seeded.');
    }

    // 7. Seed Nesal Heritage Archive (நெசல் வரலாற்றுப் பெட்டகம்)
    const heritageCount = await HeritageArchive.countDocuments();
    if (heritageCount === 0 || forceClean) {
      await HeritageArchive.create([
        {
          title: '1972 மாரியம்மன் கோவில் சித்திரைத் திருவிழா அரிய புகைப்படம்',
          titleEnglish: '1972 Nesal Mariamman Temple Chithirai Festival Rare Photo',
          category: 'Photo',
          yearOrEra: '1972 (54 ஆண்டுகளுக்கு முன்)',
          description: 'நெசல் கிராம மாரியம்மன் கோவில் தெருவில் ஊர் பொதுமக்கள் அனைவரும் ஒன்று கூடி விமரிசையாகக் கொண்டாடிய சித்திரைத் திருவிழா வரலாற்றுப் புகைப்படம். பாரம்பரிய நாதஸ்வரம், கரகாட்டம் மற்றும் தேர் பவனி.',
          fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
          fileType: 'image',
          contributorName: 'குப்புசாமி நாயக்கர் குடும்பத்தார்',
          contributorPhone: '9443123450',
          contributorWard: 'மாரியம்மன் கோவில் தெரு, நெசல்',
          isFeatured: true,
          status: 'approved',
          likesCount: 28,
          tags: ['மாரியம்மன் கோவில்', 'திருவிழா', '1972', 'பாரம்பரியம்']
        },
        {
          title: '1964 நெசல் கிராம நன்செய் நிலப்பட்டா & பழமையான வருவாய் ஆவணம்',
          titleEnglish: '1964 Nesal Village Land Patta & Ancient Revenue Record',
          category: 'Document',
          yearOrEra: '1964',
          description: 'வானூர் வட்டார எல்லைக்குள் நெசல் கிராமத்தின் ஏரிப்பாசன நன்செய் நிலங்களின் எல்லைகள் மற்றும் சர்வே எண்கள் அடங்கிய வரலாற்றுப் பட்டா ஆவணம். முன்னோர்களின் கையெழுத்து மற்றும் முத்திரையுடன் பாதுகாக்கப்பட்டது.',
          fileUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
          fileType: 'document',
          contributorName: 'முத்தையன் பிள்ளை (ஓய்வுபெற்ற ஆசிரியர்)',
          contributorPhone: '9842567812',
          contributorWard: 'தெற்குத் தெரு, நெசல்',
          isFeatured: true,
          status: 'approved',
          likesCount: 19,
          tags: ['நிலப்பட்டா', '1964', 'வானூர் வட்டம்', 'ஆவணம்']
        },
        {
          title: 'திரௌபதி அம்மன் கோவில் மகாபாரத கூத்து & தீமிதி உற்சவம் (1981)',
          titleEnglish: 'Draupadi Amman Temple Mahabharata Koothu & Firewalking Festival (1981)',
          category: 'Temple',
          yearOrEra: '1981',
          description: 'நெசல் திரௌபதி அம்மன் கோவிலில் 18 நாட்கள் நடைபெற்ற மகாபாரத பாரதப் பிரசங்கம், தெருக்கூத்து மற்றும் பக்திப் பரவசத்துடன் நடைபெற்ற தீமிதி திருவிழா வரலாற்று நினைவுக் குறிப்பு.',
          fileUrl: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80',
          fileType: 'image',
          contributorName: 'கோவிந்தசாமி & கிராம இளைஞர் நற்பணி மன்றம்',
          contributorPhone: '9787123987',
          contributorWard: 'கோவில் வீதி, நெசல்',
          isFeatured: true,
          status: 'approved',
          likesCount: 34,
          tags: ['திரௌபதி அம்மன்', 'தீமிதி', 'மகாபாரதம்', '1981']
        },
        {
          title: 'பாரம்பரிய ஏர் உழவு மற்றும் ஏரிக்கரை அறுவடை காட்சி (1978)',
          titleEnglish: 'Traditional Bullock Ploughing and Nesal Lake Harvest (1978)',
          category: 'Agriculture',
          yearOrEra: '1978',
          description: 'நெசல் கிராமத்தின் பழமையான ஏரிக்கரை பாசனத்தில் பாரம்பரிய நாட்டு மாடுகள் கொண்டு உழவு செய்து, பாரம்பரிய சீரக சம்பா மற்றும் குண்டு நெல் விளைவித்த காலத்தின் அரிய வேளாண் பதிவு.',
          fileUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
          fileType: 'image',
          contributorName: 'ஆறுமுகம் உழவர் மன்றம்',
          contributorPhone: '9442098765',
          contributorWard: 'மேலத் தெரு, நெசல்',
          isFeatured: false,
          status: 'approved',
          likesCount: 22,
          tags: ['விவசாயம்', 'ஏர் உழவு', '1978', 'நெசல் ஏரி']
        },
        {
          title: '1955 நெசல் கிராம பள்ளி தொடக்கப் பதிவு மற்றும் கல்வி வரலாறு',
          titleEnglish: '1955 Nesal Village Primary School Historical Inception Record',
          category: 'Document',
          yearOrEra: '1955',
          description: 'நெசல் கிராமத்தில் குழந்தைகள் கல்வி பயில கிராமப் பெரியோர்கள் நிலம் வழங்கி அமைக்கப்பட்ட முதல் தொடக்கப் பள்ளியின் அரசு ஆணை நகல் மற்றும் முதல் தலைமை ஆசிரியர் குறிப்பு.',
          fileUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
          fileType: 'document',
          contributorName: 'நடராஜன் (கிராம நலச் சங்கம்)',
          contributorPhone: '9843345566',
          contributorWard: 'பள்ளி தெரு, நெசல்',
          isFeatured: false,
          status: 'approved',
          likesCount: 16,
          tags: ['பள்ளி ஆவணம்', '1955', 'கல்வி வரலாறு']
        }
      ]);
      console.log('[Seed] Nesal Heritage Archive (நெசல் வரலாற்றுப் பெட்டகம்) seeded.');
    }

    // 8. Seed Nesal & Vanur Bus & Transport Schedules
    const transportCount = await TransportSchedule.countDocuments();
    if (transportCount === 0 || forceClean) {
      await TransportSchedule.create([
        {
          routeNumber: '188B / TNSTC',
          serviceName: 'திண்டிவனம் - கிளியனூர் - ஒழுந்தியாப்பட்டு - நெசல் - புதுப்பட்டு - காலாப்பட்டு - புதுச்சேரி',
          serviceNameEnglish: 'Tindivanam to Puducherry via Kilayanur, Ozunthiyapattu, Nesal, Puthupattu, Kalapet',
          serviceType: 'TownBus',
          isWomenFree: true,
          origin: 'திண்டிவனம் (Tindivanam)',
          destination: 'புதுச்சேரி (Puducherry)',
          viaStops: [
            'திண்டிவனம் (Tindivanam)',
            'கிளியனூர் (Kilayanur)',
            'ஒழுந்தியாப்பட்டு (Ozunthiyapattu)',
            'நெசல் (Nesal)',
            'புதுப்பட்டு (Puthupattu)',
            'காலாப்பட்டு (Kalapet - PIMS/University)',
            'புதுச்சேரி (Puducherry)'
          ],
          departures: [
            { time: '06:15 AM', time24: '06:15', notes: 'காலை முதல் நடை / பள்ளி & கல்லூரி நேரம்' },
            { time: '08:45 AM', time24: '08:45', notes: 'கல்லூரி, பிம்ஸ் (PIMS) & அலுவலக நேரம்' },
            { time: '11:45 AM', time24: '11:45', notes: 'மதிய நடை' },
            { time: '02:30 PM', time24: '14:30', notes: 'பிற்பகல் நடை' },
            { time: '05:15 PM', time24: '17:15', notes: 'மாலை கல்லூரி & பணி திரும்புவோர்' },
            { time: '07:45 PM', time24: '19:45', notes: 'இரவு கடைசி நடை' }
          ],
          frequencyMinutes: 140,
          frequencyNote: 'நெசல் கிராமத்திற்குள் நேரடியாக வந்து செல்லும் அரசு நகரப் பேருந்து சேவை',
          contactPhone: '04147-222345',
          driverOrStandName: 'திண்டிவனம் & வானூர் பணிமனை (TNSTC)',
          fareEstimated: 'மகளிருக்கு இலவசம் (பொது: ₹20)',
          isImportant: true,
          status: 'approved'
        },
        {
          routeNumber: '188B / TNSTC (மறுமார்க்கம்)',
          serviceName: 'புதுச்சேரி - காலாப்பட்டு - புதுப்பட்டு - நெசல் - ஒழுந்தியாப்பட்டு - கிளியனூர் - திண்டிவனம் (Vice Versa)',
          serviceNameEnglish: 'Puducherry to Tindivanam via Kalapet, Puthupattu, Nesal, Ozunthiyapattu, Kilayanur (Vice Versa)',
          serviceType: 'TownBus',
          isWomenFree: true,
          origin: 'புதுச்சேரி (Puducherry)',
          destination: 'திண்டிவனம் (Tindivanam)',
          viaStops: [
            'புதுச்சேரி புதிய பேருந்து நிலையம்',
            'காலாப்பட்டு (Kalapet - University/PIMS)',
            'புதுப்பட்டு (Puthupattu)',
            'நெசல் கிராமம் (Nesal)',
            'ஒழுந்தியாப்பட்டு (Ozunthiyapattu)',
            'கிளியனூர் (Kilayanur)',
            'திண்டிவனம் (Tindivanam)'
          ],
          departures: [
            { time: '07:15 AM', time24: '07:15', notes: 'புதுச்சேரியிலிருந்து முதல் நடை' },
            { time: '09:45 AM', time24: '09:45', notes: 'காலை சேவை (நெசல் வழி)' },
            { time: '01:00 PM', time24: '13:00', notes: 'மதிய நடை' },
            { time: '03:45 PM', time24: '15:45', notes: 'பிற்பகல் நடை' },
            { time: '06:30 PM', time24: '18:30', notes: 'மாலை கல்லூரி & அலுவலக பயணிகள் நடை' },
            { time: '08:45 PM', time24: '20:45', notes: 'இரவு கடைசி நடை' }
          ],
          frequencyMinutes: 140,
          frequencyNote: 'புதுச்சேரியிலிருந்து காலாப்பட்டு, நெசல் வழியாக திண்டிவனம் செல்லும் அரசுப் பேருந்து',
          contactPhone: '0413-2677100',
          driverOrStandName: 'புதுச்சேரி பேருந்து நிலையம் / வானூர் பணிமனை',
          fareEstimated: 'மகளிருக்கு இலவசம் (பொது: ₹20)',
          isImportant: true,
          status: 'approved'
        },
        {
          routeNumber: '188',
          serviceName: 'நெசல் - வானூர் - புதுச்சேரி நகரப் பேருந்து',
          serviceNameEnglish: 'Nesal to Puducherry Town Bus',
          serviceType: 'TownBus',
          isWomenFree: true,
          origin: 'நெசல் (Nesal)',
          destination: 'புதுச்சேரி (Puducherry)',
          viaStops: ['நெசல்', 'வானூர்', 'கிளியனூர்', 'கோரிமேடு', 'ஜிப்மர் மருத்துவமனை (JIPMER)', 'புதுச்சேரி புதிய பேருந்து நிலையம்'],
          departures: [
            { time: '06:30 AM', time24: '06:30', notes: 'முதல் நடை / கல்லூரி மாணவர்கள் நேரம்' },
            { time: '08:15 AM', time24: '08:15', notes: 'அலுவலக & ஜிப்மர் மருத்துவமனை நேரம்' },
            { time: '11:30 AM', time24: '11:30', notes: 'மதிய நடை' },
            { time: '02:45 PM', time24: '14:45', notes: 'பிற்பகல் நடை' },
            { time: '05:30 PM', time24: '17:30', notes: 'மாலை நேரக் கல்லூரி / பணி திரும்புவோர்' },
            { time: '08:00 PM', time24: '20:00', notes: 'கடைசி நடை' }
          ],
          frequencyMinutes: 120,
          frequencyNote: 'சுமார் 2 மணி நேரத்திற்கு ஒருமுறை நேரடி சேவை',
          contactPhone: '04146-240102',
          driverOrStandName: 'வானூர் அரசுப் பணிமனை (TNSTC Depot)',
          fareEstimated: 'மகளிருக்கு இலவசம் (பொது: ₹18)',
          isImportant: true,
          status: 'approved'
        },
        {
          routeNumber: '197 / 197A',
          serviceName: 'திண்டிவனம் - வானூர் - புதுச்சேரி விரைவுப் பேருந்து',
          serviceNameEnglish: 'Tindivanam to Puducherry via Vanur',
          serviceType: 'Mofussil',
          isWomenFree: false,
          origin: 'திண்டிவனம் (Tindivanam)',
          destination: 'புதுச்சேரி (Puducherry)',
          viaStops: ['திண்டிவனம்', 'மயிலம் கூட்ரோடு', 'வானூர்', 'நெசல் கூட்ரோடு', 'மொரட்டாண்டி', 'கோரிமேடு', 'புதுச்சேரி'],
          departures: [
            { time: '05:45 AM', time24: '05:45', notes: 'அதி காலை விரைவுப் பேருந்து' },
            { time: '07:15 AM', time24: '07:15', notes: 'காலை நெரிசல் சேவை' },
            { time: '09:00 AM', time24: '09:00', notes: 'வழக்கமான நடை' },
            { time: '12:30 PM', time24: '12:30', notes: 'மதிய சேவை' },
            { time: '04:15 PM', time24: '16:15', notes: 'மாலை நடை' },
            { time: '07:30 PM', time24: '19:30', notes: 'இரவு விரைவுப் பேருந்து' },
            { time: '09:45 PM', time24: '21:45', notes: 'கடைசி விரைவுப் பேருந்து' }
          ],
          frequencyMinutes: 20,
          frequencyNote: 'நெசல் கூட்ரோட்டில் ஒவ்வொரு 15 - 20 நிமிடங்களுக்கும் பேருந்து உண்டு',
          contactPhone: '04147-222345',
          driverOrStandName: 'திண்டிவனம் அரசுப் பேருந்து நிலையம்',
          fareEstimated: '₹25 - ₹35',
          isImportant: true,
          status: 'approved'
        },
        {
          routeNumber: '12B',
          serviceName: 'நெசல் - வானூர் - திண்டிவனம் நகரப் பேருந்து',
          serviceNameEnglish: 'Nesal to Tindivanam Town Bus',
          serviceType: 'TownBus',
          isWomenFree: true,
          origin: 'நெசல் (Nesal)',
          destination: 'திண்டிவனம் (Tindivanam)',
          viaStops: ['நெசல்', 'வானூர் வட்டாட்சியர் அலுவலகம்', 'தைலாபுரம்', 'மயிலம் சந்தை', 'திண்டிவனம் ரயில் நிலையம் / பழைய பேருந்து நிலையம்'],
          departures: [
            { time: '07:00 AM', time24: '07:00', notes: 'பள்ளி மற்றும் சந்தை நடை' },
            { time: '09:30 AM', time24: '09:30', notes: 'வட்டாட்சியர் அலுவலக சேவை' },
            { time: '01:15 PM', time24: '13:15', notes: 'மதிய நடை' },
            { time: '04:30 PM', time24: '16:30', notes: 'மாலை நடை' },
            { time: '07:15 PM', time24: '19:15', notes: 'இரவு கடைசி நடை' }
          ],
          frequencyMinutes: 150,
          frequencyNote: 'மகளிர் கட்டணமில்லா விடியல் பயணப் பேருந்து',
          contactPhone: '04147-222345',
          driverOrStandName: 'திண்டிவனம் பணிமனை (TNSTC)',
          fareEstimated: 'மகளிருக்கு இலவசம் (ஆண்களுக்கு ₹15)',
          isImportant: true,
          status: 'approved'
        },
        {
          routeNumber: 'விழுப்புரம் - வானூர் - மரக்காணம்',
          serviceName: 'விழுப்புரம் - வானூர் - மரக்காணம் புறநகர் பேருந்து',
          serviceNameEnglish: 'Villupuram to Marakkanam via Vanur',
          serviceType: 'Mofussil',
          isWomenFree: false,
          origin: 'விழுப்புரம் (Villupuram)',
          destination: 'மரக்காணம் (Marakkanam)',
          viaStops: ['விழுப்புரம் புதிய பேருந்து நிலையம்', 'விக்கிரவாண்டி', 'கிளியனூர்', 'வானூர்', 'நெசல் கூட்ரோடு', 'மரக்காணம் கடற்கரை'],
          departures: [
            { time: '06:00 AM', time24: '06:00', notes: 'விழுப்புரம் முதல் நடை' },
            { time: '08:30 AM', time24: '08:30', notes: 'காலை சேவை' },
            { time: '12:00 PM', time24: '12:00', notes: 'மதிய நடை' },
            { time: '03:30 PM', time24: '15:30', notes: 'பிற்பகல் சேவை' },
            { time: '06:45 PM', time24: '18:45', notes: 'மாலை நடை' }
          ],
          frequencyMinutes: 180,
          frequencyNote: 'சுமார் 3 மணி நேரத்திற்கு ஒரு பேருந்து',
          contactPhone: '04146-222450',
          driverOrStandName: 'விழுப்புரம் மத்திய பேருந்து நிலையம்',
          fareEstimated: '₹30 - ₹45',
          isImportant: false,
          status: 'approved'
        },
        {
          routeNumber: 'தனியார் (A1 / ஸ்ரீ பாலாஜி)',
          serviceName: 'நெசல் - வானூர் - திருச்சிற்றம்பலம் கூட்ரோடு - புதுச்சேரி',
          serviceNameEnglish: 'Sri Balaji Private Stage Carrier',
          serviceType: 'PrivateBus',
          isWomenFree: false,
          origin: 'நெசல் (Nesal)',
          destination: 'புதுச்சேரி (Puducherry)',
          viaStops: ['நெசல் கிராமம்', 'வானூர் வாரச்சந்தை', 'திருச்சிற்றம்பலம் கூட்ரோடு', 'ஜிப்மர்', 'புதுச்சேரி காந்தி வீதி'],
          departures: [
            { time: '07:45 AM', time24: '07:45', notes: 'காலை விரைவு தனியார் பேருந்து' },
            { time: '10:45 AM', time24: '10:45', notes: 'வாரச்சந்தை சிறப்பு நடை' },
            { time: '02:00 PM', time24: '14:00', notes: 'மதிய சேவை' },
            { time: '05:00 PM', time24: '17:00', notes: 'மாலை நடை' }
          ],
          frequencyMinutes: 180,
          frequencyNote: 'நேரடி தனியார் சிற்றுந்து சேவை',
          contactPhone: '9842512399',
          driverOrStandName: 'ஸ்ரீ பாலாஜி மோட்டார்ஸ் (வானூர்)',
          fareEstimated: '₹20 - ₹25',
          isImportant: false,
          status: 'approved'
        },
        {
          routeNumber: '🛺 ஆட்டோ ஸ்டாண்ட்',
          serviceName: 'வானூர் & நெசல் கிராம அவசர ஆட்டோ சங்கம்',
          serviceNameEnglish: 'Nesal & Vanur 24x7 Auto Stand',
          serviceType: 'Auto',
          isWomenFree: false,
          origin: 'நெசல் (Nesal)',
          destination: 'அனைத்து இடங்களுக்கும் (All Locations)',
          viaStops: ['நெசல் கிராமம்', 'வானூர் அரசு மருத்துவமனை', 'கிளியனூர் கூட்ரோடு', 'திண்டிவனம் ரயில் நிலையம்', 'ஜிப்மர் புதுச்சேரி'],
          departures: [
            { time: '24 மணி நேரமும்', time24: '00:00', notes: 'அவசர மருத்துவ சேவை & இரவிலும் கிடைக்கும்' }
          ],
          frequencyMinutes: 0,
          frequencyNote: 'தொலைபேசியில் அழைத்தால் நெசல் கிராமத்திற்கே வந்து அழைத்துச் செல்வர்',
          contactPhone: '0413-2677100',
          driverOrStandName: 'வானூர் தாலுகா ஆட்டோ ஓட்டுநர்கள் சங்கம் (9842512345 / 9787654321)',
          fareEstimated: 'குறைந்தபட்ச கட்டணம் ₹50 (மீட்டருக்கு ஏற்ப)',
          isImportant: true,
          status: 'approved'
        },
        {
          routeNumber: '🚆 ரயில் இணைப்பு',
          serviceName: 'திண்டிவனம் ரயில் நிலையம் (TMV) - சென்னை & தென் மாவட்ட ரயில்கள்',
          serviceNameEnglish: 'Tindivanam Railway Station (TMV) Key Trains',
          serviceType: 'Train',
          isWomenFree: false,
          origin: 'திண்டிவனம் ரயில் நிலையம் (25 கி.மீ)',
          destination: 'சென்னை / திருச்சி / மதுரை',
          viaStops: ['திண்டிவனம் (TMV)', 'செங்கல்பட்டு', 'தாம்பரம்', 'சென்னை எழும்பூர் (MS) / விழுப்புரம் (VM)'],
          departures: [
            { time: '05:30 AM', time24: '05:30', notes: 'விழுப்புரம் - சென்னை பயணிகள் மின்சார ரயில்' },
            { time: '07:10 AM', time24: '07:10', notes: 'சோழன் எக்ஸ்பிரஸ் (சென்னை நோக்கி)' },
            { time: '11:15 AM', time24: '11:15', notes: 'பல்லவன் சூப்பர்பாஸ்ட் (சென்னை எழும்பூர்)' },
            { time: '03:45 PM', time24: '15:45', notes: 'குருவாயூர் எக்ஸ்பிரஸ் (மதுரை / கன்னியாகுமரி நோக்கி)' },
            { time: '06:20 PM', time24: '18:20', notes: 'பாண்டியன் எக்ஸ்பிரஸ் இணைப்பு' },
            { time: '09:00 PM', time24: '21:00', notes: 'அனந்தபுரி & நெல்லை எக்ஸ்பிரஸ்' }
          ],
          frequencyMinutes: 0,
          frequencyNote: 'நெசலில் இருந்து திண்டிவனம் ரயில் நிலையத்திற்கு நேரடி பேருந்து மற்றும் ஆட்டோ வசதி உள்ளது',
          contactPhone: '139',
          driverOrStandName: 'தெற்கு ரயில்வே (Southern Railway - TMV)',
          fareEstimated: 'பயணிகள் ரயில் ₹15 | எக்ஸ்பிரஸ் ₹65+',
          isImportant: true,
          status: 'approved'
        }
      ]);
      console.log('[Seed] Nesal & Vanur Bus & Transport Schedules seeded.');
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
