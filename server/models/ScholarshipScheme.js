import mongoose from 'mongoose';

const scholarshipSchemeSchema = new mongoose.Schema({
  titleTamil: { type: String, required: true },
  titleEnglish: { type: String, required: true },
  category: {
    type: String,
    enum: ['College / Higher Education', 'School Education', 'Skill Development', 'Special Quota', 'Welfare Assistance'],
    default: 'College / Higher Education'
  },
  beneficiaryTarget: { type: String, default: '' }, // e.g. "Girls in Govt Schools (6th-12th)", "All TN Govt School Students"
  financialAssistance: { type: String, required: true }, // e.g. "₹1,000 / மாதம் (மாதந்தோறும் நேரடி வங்கி பரிமாற்றம்)"
  eligibilityTamil: { type: String, required: true },
  eligibilityEnglish: { type: String, default: '' },
  documentsRequired: [{ type: String }],
  howToApply: { type: String, default: '' },
  officialPortalUrl: { type: String, default: '' },
  deadlineOrSchedule: { type: String, default: 'ஆண்டு முழுவதும் / கல்வி ஆண்டு தொடக்கம்' },
  contactDepartment: { type: String, default: 'தமிழ்நாடு சமூக நலன் & மகளிர் உரிமைத்துறை' },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'archived'], default: 'active' }
}, {
  timestamps: true
});

const ScholarshipScheme = mongoose.model('ScholarshipScheme', scholarshipSchemeSchema);
export default ScholarshipScheme;
