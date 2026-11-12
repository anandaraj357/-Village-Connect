import mongoose from 'mongoose';

const NotificationSubscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    subscriberName: { type: String, default: 'Nesal Resident' },
    subscriberEmail: { type: String, trim: true },
    subscriberPhone: { type: String, trim: true },
    deviceToken: { type: String },
    categories: [
      {
        type: String,
        enum: [
          'All',
          'Government Jobs',
          'Private & IT Jobs',
          'Recruitment Alerts',
          'Village & Taluk News',
          'Village & Mandal News',
          'District Announcements',
          'Agriculture',
          'Education',
          'Government Schemes'
        ]
      }
    ],
    geographicFilter: {
      state: { type: String, default: 'Tamil Nadu' },
      district: { type: String, default: 'Villupuram' },
      mandal: { type: String, default: 'Vanur' },
      village: { type: String, default: 'Nesal' }
    },
    channels: {
      inApp: { type: Boolean, default: true },
      webPush: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false }
    },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

NotificationSubscriptionSchema.index({ active: 1, categories: 1 });

export default mongoose.model('NotificationSubscription', NotificationSubscriptionSchema);
