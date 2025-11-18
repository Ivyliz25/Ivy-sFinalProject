import mongoose from 'mongoose';

const wasteLogSchema = new mongoose.Schema({
    trader: { type: mongoose.Schema.Types.ObjectId, ref: 'Trader' },
    date: { type: Date, default: Date.now },
    wasteKg: { type: Number, required: true }
});

export default mongoose.model('WasteLog', wasteLogSchema);
