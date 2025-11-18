// models/EmissionLog.js
import mongoose from 'mongoose';

const emissionLogSchema = new mongoose.Schema(
  {
    trader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trader',
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null
    },
    activityType: {
      type: String,
      enum: ['transport', 'production', 'packaging', 'other'],
      required: true
    },
    carbonEmission: {
      type: Number, // kg CO2 equivalent
      required: true,
      min: 0
    },
    notes: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

const EmissionLog = mongoose.model('EmissionLog', emissionLogSchema);
export default EmissionLog;
