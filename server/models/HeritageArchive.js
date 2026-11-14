import mongoose from 'mongoose';

const HeritageArchiveSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    titleEnglish: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Photo', 'Document', 'Temple', 'Agriculture', 'FamilyHistory', 'General'],
      default: 'Photo'
    },
    yearOrEra: {
      type: String,
      default: 'பாரம்பரியம் / காலம் தெரியவில்லை'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    fileUrl: {
      type: String,
      default: ''
    },
    fileType: {
      type: String,
      enum: ['image', 'document', 'pdf'],
      default: 'image'
    },
    contributorName: {
      type: String,
      required: true,
      trim: true
    },
    contributorPhone: {
      type: String,
      trim: true,
      default: ''
    },
    contributorWard: {
      type: String,
      trim: true,
      default: 'நெசல் கிராமம்'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved'
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    likesCount: {
      type: Number,
      default: 0
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ]
  },
  {
    timestamps: true
  }
);

// Indexes for quick searching & category filtering
HeritageArchiveSchema.index({ category: 1, createdAt: -1 });
HeritageArchiveSchema.index({ title: 'text', description: 'text', yearOrEra: 'text' });

export default mongoose.model('HeritageArchive', HeritageArchiveSchema);
