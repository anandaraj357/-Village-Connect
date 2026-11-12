import mongoose from 'mongoose';

const CrawlingLogSchema = new mongoose.Schema(
  {
    sourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'CrawlerSource' },
    sourceName: { type: String, default: 'System' },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'CrawlerJob' },
    level: {
      type: String,
      enum: ['info', 'warn', 'error', 'debug'],
      default: 'info'
    },
    action: { type: String, required: true },
    message: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: false }
);

CrawlingLogSchema.index({ timestamp: -1 });
CrawlingLogSchema.index({ level: 1, timestamp: -1 });

export default mongoose.model('CrawlingLog', CrawlingLogSchema);
