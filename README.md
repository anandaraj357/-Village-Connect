# OUR VILLAGE - Automated Web Crawling and AI-Powered Information Aggregation System

A scalable, multi-tier MERN stack and AI-powered information aggregation system built for **OUR VILLAGE (మన గ్రామం)**. The system automatically crawls, extracts, cleans, verifies, summarizes, translates, and organizes job vacancies, government recruitment notifications, district announcements, and daily news highlights from authorized external portals.

---

## 🌟 Key Architecture Highlights

```
                                  [External Portals]
          (NCS, Employment News, APPSC, SSC/RRB, District Collectorate, RBK)
                                           │
                                           ▼
                       ┌────────────────────────────────────────┐
                       │    SECURITY & SSRF GUARD LAYER         │
                       │ (DNS Resolution, IP Whitelist, RegEx)  │
                       └───────────────────┬────────────────────┘
                                           │
               ┌───────────────────────────┼───────────────────────────┐
               ▼                           ▼                           ▼
      [Cheerio/Axios]              [Playwright Engine]          [RSS/Atom Parser]
    (Static HTML Scraper)        (JavaScript Dynamic Sites)    (Feeds & Circulars)
               │                           │                           │
               └───────────────────────────┼───────────────────────────┘
                                           │
                                           ▼
                       ┌────────────────────────────────────────┐
                       │     PDF EXTRACTION & REGEX PARSER      │
                       │ (Notification #, Vacancies, Fee, Dates)│
                       └───────────────────┬────────────────────┘
                                           │
                                           ▼
                       ┌────────────────────────────────────────┐
                       │      AI CONTENT PROCESSING ENGINE      │
                       │  - HTML Cleaning & Categorization      │
                       │  - Concise Factual Summarization       │
                       │  - English to Telugu Translation       │
                       │  - Anti-Hallucination Guardrails       │
                       │  - Confidence Scoring (0-100%)         │
                       └───────────────────┬────────────────────┘
                                           │
                                           ▼
                       ┌────────────────────────────────────────┐
                       │      DUPLICATE & REVISION DETECTOR     │
                       │  - Canonical URL & SHA256 Hashing      │
                       │  - Auto-detect Revision vs Duplicate   │
                       └───────────────────┬────────────────────┘
                                           │
                                           ▼
                       ┌────────────────────────────────────────┐
                       │    ADMIN APPROVAL GATEWAY (TWO-TIER)   │
                       │  Preview • Approve • Edit • Reject     │
                       └───────────────────┬────────────────────┘
                                           │ (Published by Admin)
                                           ▼
                       ┌────────────────────────────────────────┐
                       │       PUBLIC VILLAGE APPLICATION       │
                       │  Jobs • Recruitments • News • Alerts   │
                       └───────────────────┬────────────────────┘
                                           │
                                           ▼
                       ┌────────────────────────────────────────┐
                       │      NOTIFICATION & ALERT CENTER       │
                       │ (In-App Badges, Web Push, Category Subs│
                       └────────────────────────────────────────┘
```

---

## 📂 10 MongoDB Collections

The system creates and maintains 10 specialized Mongoose collections:

1. **`CrawlerSources`**: Registry of configured websites, extraction adapters, scraping frequencies, geographic scopes, and health statuses.
2. **`CrawlerJobs`**: Execution history and audit records for each scheduled or manual crawl run with duration, duplicate count, and error tracking.
3. **`CrawledRecords`**: Raw and cleaned crawled data with SHA-256 hashes, AI analysis results, and approval status.
4. **`CrawlingLogs`**: Operational audit logs tracking URL fetching, parsing, AI steps, and errors in real-time.
5. **`ContentApprovals`**: The gatekeeper queue ("Crawled Data – Pending Approval") displaying verification status, confidence score, and admin actions.
6. **`ContentRevisions`**: Immutable revision history tracking updates to existing recruitment notifications.
7. **`JobVacancies`**: Public collection of verified job opportunities categorized into Government, Private, IT, Non-IT, Internship, Local Job, and Work From Home.
8. **`RecruitmentNotifications`**: Public gazetted recruitment notifications with official numbers, age limits, fees, and PDF links.
9. **`NewsArticles`**: Public news articles with bilingual (English & Telugu) summaries, categorized by Village, Mandal, District, Agriculture, etc.
10. **`NotificationSubscriptions`**: Citizen subscription preferences for category-specific notifications (SMS, Web Push, In-App).

---

## 🚀 Automated Scheduler (BullMQ + Redis)

Background scheduling is handled by BullMQ connected to Redis:

- **Job Vacancies**: Every 2 Hours (120 min)
- **Recruitment Notifications**: Every 2 Hours (120 min)
- **District Announcements**: Every 2 Hours (120 min)
- **Daily News & Highlights**: Every 45 Minutes (30–60 min)
- **Concurrency Locks**: In-memory and queue mutex locks prevent overlapping crawl jobs for the same source.
- **Retry Mechanism**: 3 automatic retries with exponential backoff (`delay: 5000ms`).

---

## 🛡️ Security & Reliability Features

- **SSRF Protection**: Resolves target hostnames against DNS and strictly blocks loopback (`127.0.0.0/8`), private networks (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), link-local/cloud metadata (`169.254.169.254`), and non-HTTP/HTTPS protocols.
- **Anti-Bot Compliance**: Scrapers respect `robots.txt`, obey rate limits (default 10 req/min), send polite User-Agent headers, and never bypass authentication or CAPTCHAs.
- **Anti-Hallucination AI**: Gemini / Heuristic pipeline strictly forbids inventing salaries, eligibility criteria, application dates, or notification numbers. Missing fields are explicitly marked as `Unavailable` for administrator review.
- **Bilingual Support**: Instant high-quality Telugu translations for rural citizens.

---

## 🖥️ Admin Dashboard (7 Management Screens)

Accessible via the **Admin Portal** button on the navbar:

1. **Pending Approvals ("Crawled Data – Pending Approval")**: Review items with confidence scores, preview full structured data, edit fields, approve, publish, reject, or mark as important.
2. **Screen 1: Collected Jobs**: Filter and manage published employment opportunities.
3. **Screen 2: Recruitment Notifications**: View official notification numbers, total vacancies, and revision logs.
4. **Screen 3: Daily News**: Inspect published rural, agricultural, and district news with bilingual summaries.
5. **Screen 4: District Announcements**: Manage district collectorate press releases and circulars.
6. **Screen 5: Crawler Sources**: Configure URLs, select adapters, toggle enabled status, and trigger instant manual crawls.
7. **Screen 6: Crawler Execution Logs**: Live streaming terminal of scraper actions, warnings, and errors with auto-refresh.
8. **Screen 7 / Settings: Scheduler Settings**: Inspect BullMQ queue metrics and re-sync repeat jobs.

---

## 🧪 Testing Instructions

Run the automated test suite covering all 7 test categories:

```bash
cd server
node test/testCrawler.js
```

### Verified Test Categories:
- ✅ SSRF loopback & cloud metadata blocking
- ✅ HTML sanitizer and script tag removal
- ✅ Normalized content hashing and duplicate detection
- ✅ PDF structured extraction (notification #, vacancies, age limit, fee, dates)
- ✅ AI summarization (English + Telugu translation, confidence scoring)
- ✅ Real crawler engine execution on configured sources
- ✅ Admin approval and publishing transition to public collections
- ✅ BullMQ & Redis scheduler queue integration

---

## 📦 Deployment & Setup Guide

### Prerequisites
- Node.js >= 18
- MongoDB Server (running on port 27017)
- Redis Server (running on port 6379)

### 1. Install Server Dependencies
```bash
cd server
npm install
npx playwright install chromium
```

### 2. Configure Environment (`server/.env`)
```ini
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/our_village_crawler
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
JWT_SECRET=our_village_super_secure_jwt_secret_crawler_2026
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Install Client Dependencies & Build
```bash
cd ../client
npm install
npm run build
```

### 4. Start the Application
```bash
# Start backend server (serves API and production client build)
cd ../server
npm start
```
The application will be live at: **http://localhost:5000** (or **http://localhost:5173** in Vite development mode).
