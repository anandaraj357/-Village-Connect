# OUR VILLAGE (நமது கிராமம்) - Automated Web Crawling and AI-Powered Information Aggregation System

A scalable, multi-tier MERN stack and AI-powered information aggregation system customized for **Nesal Village, Vanur Taluk, Villupuram District, Tamil Nadu (நெசல் கிராமம், வானூர் வட்டம், விழுப்புரம் மாவட்டம், தமிழ்நாடு)**.

The system automatically crawls, extracts, cleans, verifies, summarizes, translates into **Tamil (தமிழ்)**, and organizes job vacancies, government recruitment notifications (TNPSC / SSC), district announcements, and daily agricultural and civic news highlights from authorized external portals.

---

## 📍 Geographic & Administrative Configuration

- **Village**: Nesal (நெசல்)
- **Taluk / Block**: Vanur (வானூர்)
- **District**: Villupuram (விழுப்புரம்)
- **State**: Tamil Nadu (தமிழ்நாடு)
- **Postal Code**: 604102
- **Primary Languages**: Tamil (தமிழ்) & English

---

## 🌟 Key Architecture Highlights

```
                                  [External Portals]
          (TNPSC, NCS-TN, Employment News, SSC-SR Chennai, Villupuram Collectorate, TNAU)
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
                       │  - Concise Factual Summaries           │
                       │  - English to Tamil Translation        │
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
                       │  Jobs • TNPSC Notices • News • Alerts  │
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

The system maintains 10 specialized Mongoose collections:

1. **`CrawlerSources`**: Registry of configured websites, extraction adapters, scraping frequencies, geographic scopes (Nesal/Vanur/Villupuram/Tamil Nadu), and live health metrics.
2. **`CrawlerJobs`**: Execution history and audit records for each scheduled or manual crawl run with duration, duplicate count, and error tracking.
3. **`CrawledRecords`**: Raw and cleaned crawled data with SHA-256 hashes, AI analysis payloads, confidence scores, and pending flags.
4. **`CrawlingLogs`**: Operational audit logs tracking URL fetching, parsing, AI steps, and errors in real-time.
5. **`ContentApprovals`**: The gatekeeper queue ("Crawled Data – Pending Approval") displaying verification status, confidence score, and admin actions.
6. **`ContentRevisions`**: Immutable revision history tracking updates to existing recruitment notifications (e.g. TNPSC notification amendments).
7. **`JobVacancies`**: Public collection of verified job opportunities categorized into Government, Private, IT, Non-IT, Internship, Local Job, and Work From Home.
8. **`RecruitmentNotifications`**: Public gazetted recruitment notifications (TNPSC Group-IV, Group-II, VAO, SSC) with official numbers, age limits, fees, and PDF links.
9. **`NewsArticles`**: Public news articles with bilingual (English & Tamil) summaries, categorized by Village, Taluk, District, Agriculture, Schemes, etc.
10. **`NotificationSubscriptions`**: Citizen subscription preferences for category-specific notifications (SMS, Web Push, In-App).

---

## 🚀 Automated Scheduler (BullMQ + Redis)

Background scheduling is handled by BullMQ connected to Redis:

- **Job Vacancies**: Every 2 Hours (120 min)
- **Recruitment Notifications (TNPSC)**: Every 2 Hours (120 min)
- **District Announcements**: Every 2 Hours (120 min)
- **Daily News & Highlights**: Every 45 Minutes (30–60 min)
- **Concurrency Locks**: In-memory and queue mutex locks prevent overlapping crawl jobs for the same source.
- **Retry Mechanism**: 3 automatic retries with exponential backoff (`delay: 5000ms`).

---

## 📱 Mobile App & Web App Architecture

OUR VILLAGE provides both a **Desktop Web Portal** and **Cross-Platform Mobile Apps**:

### 1. Unified Web & Mobile PWA (`client/`)
- **Responsive Mobile Bottom Navigation**: 5 thumb-friendly touch targets (`Home`, `Jobs`, `Recruitments`, `News`, `GPS Location`).
- **Mobile Bottom Sheet Drawer**: Touch-friendly pull-up drawer for state and district selection.
- **Installable Progressive Web App (PWA)**: Includes `manifest.json`, service worker offline caching, and automatic "Add to Home Screen" installation prompt.
- **WhatsApp Share**: 1-click sharing of verified job openings and district announcements formatted with emojis for rural citizen groups.
- **Interactive Device Previewer**: Toggle between `Web View` and `Mobile App View` (an interactive smartphone simulator frame) directly on desktop.

### 2. Native Mobile Packaging with Capacitor
Wrap the web client into an official native Android (`.apk` / `.aab`) and iOS (`.ipa`) app using [capacitor.config.json](file:///c:/Users/TEMP/-Village-Connect/capacitor.config.json):
```bash
# Build the client web assets
cd client
npm run build

# Add native Android platform
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap add android
npx cap open android
```

### 3. Standalone React Native / Expo App (`mobile/`)
A pure native cross-platform mobile application utilizing hardware GPS (`expo-location`), native push notifications, and bottom tabs connecting to the backend API:
```bash
cd mobile
npm install
npm start
# Press 'a' for Android emulator or 'i' for iOS simulator
```

---

## 🖥️ Active URLs

- **Public Web Application & API**: [http://localhost:5000](http://localhost:5000)
- **Vite Frontend Development Server**: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Testing Instructions

Run the automated test suite:

```bash
cd server
node test/testCrawler.js
```
