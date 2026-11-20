import mongoose from 'mongoose';

const bloodDonorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    required: true
  },
  ward: { type: String, default: 'Ward 1 - நெசல் கிராம நத்தம்' },
  village: { type: String, default: 'Nesal' },
  taluk: { type: String, default: 'Vanur' },
  phone: { type: String, required: true },
  altPhone: { type: String, default: '' },
  age: { type: Number, default: 25 },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
  isAvailable: { type: Boolean, default: true },
  lastDonationDate: { type: Date, default: null },
  willingToTravelTo: { type: String, default: 'வானூர், ஜிப்மர் புதுச்சேரி, திண்டிவனம்' },
  verifiedStatus: { type: String, enum: ['verified', 'pending'], default: 'verified' }
}, {
  timestamps: true
});

const BloodDonor = mongoose.model('BloodDonor', bloodDonorSchema);
export default BloodDonor;
