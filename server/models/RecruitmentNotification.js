import mongoose from 'mongoose';

const RecruitmentNotificationSchema = new mongoose.Schema(
  {
    recruitmentName: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    notificationNumber: { type: String, required: true, index: true },
    totalVacancies: { type: Number, default: 0 },
    postNames: [{ type: String }],
    eligibility: { type: String, default: 'See Official Notification' },
    ageLimit: { type: String, default: 'Unavailable' },
    applicationFee: { type: String, default: 'Unavailable' },
    selectionProcess: { type: String, default: 'Written Exam / Interview' },
    importantDates: {
      notificationDate: { type: Date },
      applicationStartDate: { type: Date },
      applicationLastDate: { type: Date },
      examDate: { type: String, default: 'To be announced' }
    },
    officialPdfUrl: { type: String },
    officialApplicationLink: { type: String },
    sourceUrl: { type: String, required: true },
    pdfExtractedText: { type: String },
    missingFields: [{ type: String }],
    confidenceScore: { type: Number, default: 90 },
    isImportant: { type: Boolean, default: false },
    currentRevision: { type: Number, default: 1 },
    revisionHistory: [
      {
        revisionNumber: Number,
        date: { type: Date, default: Date.now },
        summary: String,
        updatedFields: [String]
      }
    ],
    approvalId: { type: mongoose.Schema.Types.ObjectId, ref: 'ContentApproval' },
    originalRecordId: { type: mongoose.Schema.Types.ObjectId, ref: 'CrawledRecord' }
  },
  { timestamps: true }
);

RecruitmentNotificationSchema.index({ organization: 1 });
RecruitmentNotificationSchema.index({ 'importantDates.applicationLastDate': 1 });

export default mongoose.model('RecruitmentNotification', RecruitmentNotificationSchema);
