import mongoose from 'mongoose';

const wasteLogSchema = new mongoose.Schema(
  {
    trader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trader',
      required: true
    },
    wasteType: {
      type: String,
      enum: ['organic', 'plastic', 'paper', 'metal', 'other'],
      required: true
    },
    quantity: {
      type: Number, // in kg
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

const WasteLog = mongoose.model('WasteLog', wasteLogSchema);
export default WasteLog;
