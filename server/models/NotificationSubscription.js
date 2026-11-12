import mongoose from 'mongoose';

const NotificationSubscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    subscriberName: { type: String, default: 'Village Resident' },
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
          'Village & Mandal News',
          'District Announcements',
          'Agriculture',
          'Education',
          'Government Schemes'
        ]
      }
    ],
    geographicFilter: {
      state: { type: String, default: 'Andhra Pradesh' },
      district: { type: String, default: 'Guntur' },
      mandal: { type: String, default: 'Tenali' },
      village: { type: String, default: 'Angalakuduru' }
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
