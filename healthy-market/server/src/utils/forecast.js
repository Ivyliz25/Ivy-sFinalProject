import mongoose from 'mongoose';

const emissionLogSchema = new mongoose.Schema({
    trader: { type: mongoose.Schema.Types.ObjectId, ref: 'Trader' },
    date: { type: Date, default: Date.now },
    emissionKg: { type: Number, required: true }
});

export default mongoose.model('EmissionLog', emissionLogSchema);
