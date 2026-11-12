import mongoose from 'mongoose';

const InAppNotificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    category: { type: String, required: true },
    type: {
      type: String,
      enum: ['job', 'recruitment', 'news', 'announcement', 'system'],
      default: 'system'
    },
    referenceId: { type: mongoose.Schema.Types.ObjectId },
    link: { type: String },
    isImportant: { type: Boolean, default: false },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

InAppNotificationSchema.index({ category: 1, createdAt: -1 });

export default mongoose.model('InAppNotification', InAppNotificationSchema);
