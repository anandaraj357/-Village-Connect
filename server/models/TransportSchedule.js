import mongoose from 'mongoose';

const TransportScheduleSchema = new mongoose.Schema(
  {
    routeNumber: {
      type: String,
      trim: true,
      default: ''
    },
    serviceName: {
      type: String,
      required: true,
      trim: true
    },
    serviceNameEnglish: {
      type: String,
      trim: true,
      default: ''
    },
    serviceType: {
      type: String,
      enum: ['TownBus', 'Mofussil', 'PrivateBus', 'Auto', 'Train'],
      default: 'TownBus'
    },
    isWomenFree: {
      type: Boolean,
      default: false
    },
    origin: {
      type: String,
      required: true,
      trim: true,
      default: 'நெசல் (Nesal)'
    },
    destination: {
      type: String,
      required: true,
      trim: true
    },
    viaStops: [
      {
        type: String,
        trim: true
      }
    ],
    departures: [
      {
        time: { type: String, required: true },
        time24: { type: String, required: true },
        notes: { type: String, default: '' },
        operatingDays: { type: String, default: 'தினசரி (Daily)' }
      }
    ],
    frequencyMinutes: {
      type: Number,
      default: 0
    },
    frequencyNote: {
      type: String,
      default: ''
    },
    contactPhone: {
      type: String,
      trim: true,
      default: ''
    },
    driverOrStandName: {
      type: String,
      trim: true,
      default: ''
    },
    fareEstimated: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['approved', 'pending', 'inactive'],
      default: 'approved'
    },
    isImportant: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

TransportScheduleSchema.index({ destination: 1, serviceType: 1 });
TransportScheduleSchema.index({ 'departures.time24': 1 });

export default mongoose.model('TransportSchedule', TransportScheduleSchema);
