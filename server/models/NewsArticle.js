import mongoose from 'mongoose';

const NewsArticleSchema = new mongoose.Schema(
  {
    headline: { type: String, required: true, trim: true },
    shortDescription: { type: String, trim: true },
    summaryEnglish: { type: String, required: true },
    summaryTelugu: { type: String },
    category: {
      type: String,
      required: true,
      enum: [
        'Village News',
        'Mandal News',
        'District News',
        'Andhra Pradesh News',
        'National News',
        'Education',
        'Technology',
        'Agriculture',
        'Employment',
        'Sports',
        'Government Schemes',
        'Important Announcements'
      ],
      default: 'District News'
    },
    sourceWebsite: { type: String, required: true },
    originalArticleUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    geographicRelevance: {
      scope: {
        type: String,
        enum: ['Village', 'Mandal', 'District', 'Andhra Pradesh', 'National'],
        default: 'District'
      },
      state: { type: String, default: 'Andhra Pradesh' },
      district: { type: String, default: 'Guntur' },
      mandal: { type: String, default: 'Tenali' },
      village: { type: String, default: 'Angalakuduru' }
    },
    publishedDate: { type: Date, default: Date.now },
    crawledDate: { type: Date, default: Date.now },
    confidenceScore: { type: Number, default: 95 },
    isImportant: { type: Boolean, default: false },
    viewsCount: { type: Number, default: 0 },
    approvalId: { type: mongoose.Schema.Types.ObjectId, ref: 'ContentApproval' },
    originalRecordId: { type: mongoose.Schema.Types.ObjectId, ref: 'CrawledRecord' }
  },
  { timestamps: true }
);

NewsArticleSchema.index({ category: 1, publishedDate: -1 });
NewsArticleSchema.index({ 'geographicRelevance.district': 1 });
NewsArticleSchema.index({ isImportant: 1, publishedDate: -1 });

export default mongoose.model('NewsArticle', NewsArticleSchema);
