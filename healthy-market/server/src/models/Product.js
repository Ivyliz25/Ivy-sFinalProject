import mongoose from 'mongoose';
import { getProducts } from "../controllers/productController.js";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, default: 'pieces' },
    category: String,
    carbonEmission: { type: Number, default: 0 },
    image: { type: String },
    trader: { type: mongoose.Schema.Types.ObjectId, ref: 'Trader' },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
