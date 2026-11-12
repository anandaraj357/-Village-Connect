import mongoose from 'mongoose';

const ContentRevisionSchema = new mongoose.Schema(
  {
    targetCollection: {
      type: String,
      required: true,
      enum: ['RecruitmentNotifications', 'JobVacancies', 'NewsArticles']
    },
    targetDocumentId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    notificationNumber: { type: String, index: true },
    revisionNumber: { type: Number, required: true, default: 1 },
    changeSummary: { type: String, required: true },
    previousState: { type: mongoose.Schema.Types.Mixed },
    newState: { type: mongoose.Schema.Types.Mixed },
    updatedFields: [{ type: String }],
    sourceUrl: { type: String },
    revisedAt: { type: Date, default: Date.now },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

ContentRevisionSchema.index({ targetDocumentId: 1, revisionNumber: -1 });

export default mongoose.model('ContentRevision', ContentRevisionSchema);
