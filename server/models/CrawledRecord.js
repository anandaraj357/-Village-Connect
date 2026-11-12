import mongoose from 'mongoose';

const CrawledRecordSchema = new mongoose.Schema(
  {
    sourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'CrawlerSource', required: true },
    sourceName: { type: String, required: true },
    sourceUrl: { type: String, required: true },
    canonicalUrl: { type: String, required: true, index: true },
    recordType: {
      type: String,
      required: true,
      enum: ['job', 'recruitment', 'news', 'announcement']
    },
    title: { type: String, required: true, trim: true },
    contentHash: { type: String, required: true, index: true },
    rawContent: { type: String },
    cleanedContent: { type: String },
    extractedData: { type: mongoose.Schema.Types.Mixed, default: {} },
    aiProcessed: { type: Boolean, default: false },
    aiAnalysis: {
      summaryEnglish: { type: String },
      summaryTelugu: { type: String },
      confidenceScore: { type: Number, default: 0 },
      categoryIdentified: { type: String },
      missingFields: [{ type: String }],
      authenticityScore: { type: Number, default: 100 },
      verificationFlags: [{ type: String }],
      aiModel: { type: String }
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'published', 'revision_created'],
      default: 'pending',
      index: true
    },
    isDuplicate: { type: Boolean, default: false, index: true },
    duplicateOf: { type: mongoose.Schema.Types.ObjectId, ref: 'CrawledRecord' },
    isRevision: { type: Boolean, default: false },
    revisionTargetId: { type: mongoose.Schema.Types.ObjectId },
    crawledAt: { type: Date, default: Date.now },
    publishedAt: { type: Date }
  },
  { timestamps: true }
);

CrawledRecordSchema.index({ canonicalUrl: 1, recordType: 1 });
CrawledRecordSchema.index({ approvalStatus: 1, createdAt: -1 });

export default mongoose.model('CrawledRecord', CrawledRecordSchema);
