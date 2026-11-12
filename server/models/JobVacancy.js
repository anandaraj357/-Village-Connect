import mongoose from 'mongoose';

const JobVacancySchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true, trim: true },
    organizationName: { type: String, required: true, trim: true },
    jobCategory: {
      type: String,
      required: true,
      enum: ['Government', 'Private', 'IT', 'Non-IT', 'Internship', 'Work From Home', 'Local Job'],
      default: 'Government'
    },
    qualification: { type: String, default: 'Not Specified' },
    requiredExperience: { type: String, default: 'Freshers / Experienced' },
    salary: { type: String, default: 'As per norms' },
    vacanciesCount: { type: Number, default: 1 },
    jobLocation: { type: String, default: 'Tamil Nadu (Villupuram / Chennai)' },
    district: { type: String, default: 'Villupuram' },
    applicationStartDate: { type: Date },
    applicationLastDate: { type: Date },
    officialNotificationUrl: { type: String },
    applicationUrl: { type: String },
    sourceWebsite: { type: String, required: true },
    datePublished: { type: Date, default: Date.now },
    dateCrawled: { type: Date, default: Date.now },
    jobDescription: { type: String },
    originalPdfUrl: { type: String },
    confidenceScore: { type: Number, default: 95 },
    isImportant: { type: Boolean, default: false },
    viewsCount: { type: Number, default: 0 },
    approvalId: { type: mongoose.Schema.Types.ObjectId, ref: 'ContentApproval' },
    originalRecordId: { type: mongoose.Schema.Types.ObjectId, ref: 'CrawledRecord' }
  },
  { timestamps: true }
);

JobVacancySchema.index({ jobCategory: 1, applicationLastDate: 1 });
JobVacancySchema.index({ jobLocation: 1 });
JobVacancySchema.index({ isImportant: 1, createdAt: -1 });

export default mongoose.model('JobVacancy', JobVacancySchema);
