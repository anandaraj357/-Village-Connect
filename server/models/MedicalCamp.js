import mongoose from 'mongoose';

const medicalCampSchema = new mongoose.Schema({
  titleTamil: { type: String, required: true },
  titleEnglish: { type: String, required: true },
  campType: {
    type: String,
    enum: ['General Health', 'Eye Camp', 'Maternal & Child', 'Vaccination / Polio', 'Veterinary / Livestock', 'Specialist Doctor'],
    default: 'General Health'
  },
  organizer: { type: String, default: 'வானூர் அரசு வட்டார ஆரம்ப சுகாதார நிலையம் (Vanur BPHC)' },
  locationVenue: { type: String, required: true }, // e.g. "நெசல் ஊராட்சி ஒன்றிய தொடக்கப்பள்ளி வளாகம்"
  village: { type: String, default: 'Nesal' },
  taluk: { type: String, default: 'Vanur' },
  district: { type: String, default: 'Villupuram' },
  campDate: { type: Date, required: true },
  timing: { type: String, required: true }, // e.g. "காலை 9:00 மணி முதல் மதியம் 1:30 மணி வரை"
  doctorInCharge: { type: String, default: 'வானூர் வட்டார மருத்துவ அலுவலர்' },
  contactPhone: { type: String, default: '0413-2677222' },
  servicesOffered: [{ type: String }],
  fee: { type: String, default: 'முற்றிலும் இலவசம் (Free for all)' },
  isImportant: { type: Boolean, default: true },
  status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming' }
}, {
  timestamps: true
});

const MedicalCamp = mongoose.model('MedicalCamp', medicalCampSchema);
export default MedicalCamp;
