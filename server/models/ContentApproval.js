import mongoose from 'mongoose';

const ContentApprovalSchema = new mongoose.Schema(
  {
    recordId: { type: mongoose.Schema.Types.ObjectId, ref: 'CrawledRecord', required: true, index: true },
    recordType: {
      type: String,
      required: true,
      enum: ['job', 'recruitment', 'news', 'announcement']
    },
    title: { type: String, required: true },
    category: { type: String, default: 'General' },
    sourceName: { type: String, required: true },
    sourceUrl: { type: String, required: true },
    publicationDate: { type: Date, default: Date.now },
    summary: { type: String },
    summaryTelugu: { type: String },
    confidenceScore: { type: Number, default: 0 },
    verificationStatus: {
      type: String,
      enum: ['verified', 'unverified', 'needs_review', 'flagged'],
      default: 'needs_review'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'edited', 'published'],
      default: 'pending',
      index: true
    },
    isImportant: { type: Boolean, default: false },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    adminComments: { type: String },
    editedFields: { type: mongoose.Schema.Types.Mixed },
    publishedCollection: {
      type: String,
      enum: ['JobVacancies', 'RecruitmentNotifications', 'NewsArticles']
    },
    publishedDocumentId: { type: mongoose.Schema.Types.ObjectId }
  },
  { timestamps: true }
);

ContentApprovalSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('ContentApproval', ContentApprovalSchema);
