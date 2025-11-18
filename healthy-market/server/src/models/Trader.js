import mongoose from 'mongoose';

const traderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['trader', 'admin'], default: 'trader' },
    // Public profile fields (optional)
    bio: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    productCount: { type: Number, default: 0 },
    location: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Trader', traderSchema);
