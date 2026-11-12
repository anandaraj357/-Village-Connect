import mongoose from 'mongoose';

const CrawlerSourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['job', 'recruitment', 'news', 'announcement']
    },
    subCategory: { type: String, default: 'general' },
    crawlerType: {
      type: String,
      required: true,
      enum: ['rss', 'static_html', 'playwright_js', 'api'],
      default: 'static_html'
    },
    adapterKey: { type: String, required: true },
    rssFeedUrl: { type: String, trim: true },
    extractionRules: {
      listSelector: { type: String },
      itemTitleSelector: { type: String },
      itemLinkSelector: { type: String },
      itemDateSelector: { type: String },
      itemSummarySelector: { type: String },
      pdfLinkSelector: { type: String },
      headers: { type: Map, of: String },
      pagination: { enabled: Boolean, maxPages: Number }
    },
    scheduleIntervalMinutes: { type: Number, default: 120 },
    cronExpression: { type: String },
    enabled: { type: Boolean, default: true },
    trusted: { type: Boolean, default: true },
    respectRobotsTxt: { type: Boolean, default: true },
    rateLimitPerMinute: { type: Number, default: 10 },
    requestTimeoutMs: { type: Number, default: 15000 },
    geographicScope: {
      type: String,
      enum: ['Village', 'Mandal', 'District', 'Andhra Pradesh', 'National'],
      default: 'Andhra Pradesh'
    },
    district: { type: String, default: 'Guntur' },
    mandal: { type: String, default: 'Tenali' },
    village: { type: String, default: 'Angalakuduru' },
    lastCrawledAt: { type: Date },
    lastStatus: {
      type: String,
      enum: ['idle', 'in_progress', 'success', 'failed'],
      default: 'idle'
    },
    lastErrorMessage: { type: String },
    totalCrawlCount: { type: Number, default: 0 },
    successCount: { type: Number, default: 0 },
    failureCount: { type: Number, default: 0 },
    lastExtractedCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

CrawlerSourceSchema.index({ category: 1, enabled: 1 });
CrawlerSourceSchema.index({ adapterKey: 1 });

export default mongoose.model('CrawlerSource', CrawlerSourceSchema);
