import mongoose from 'mongoose';

const CrawlerJobSchema = new mongoose.Schema(
  {
    sourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'CrawlerSource', required: true },
    sourceName: { type: String, required: true },
    jobType: {
      type: String,
      required: true,
      enum: ['job', 'recruitment', 'news', 'announcement']
    },
    bullJobId: { type: String },
    status: {
      type: String,
      enum: ['queued', 'running', 'completed', 'failed', 'retrying'],
      default: 'queued'
    },
    triggerType: {
      type: String,
      enum: ['manual', 'scheduled'],
      default: 'scheduled'
    },
    startedAt: { type: Date },
    completedAt: { type: Date },
    durationMs: { type: Number, default: 0 },
    recordsFound: { type: Number, default: 0 },
    recordsNew: { type: Number, default: 0 },
    recordsUpdated: { type: Number, default: 0 },
    recordsDuplicates: { type: Number, default: 0 },
    errors: [{ type: String }],
    metrics: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

CrawlerJobSchema.index({ status: 1, createdAt: -1 });
CrawlerJobSchema.index({ sourceId: 1, createdAt: -1 });

export default mongoose.model('CrawlerJob', CrawlerJobSchema);
