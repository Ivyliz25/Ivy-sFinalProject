import Trader from '../models/Trader.js';

export const getTraders = async (req, res, next) => {
    try {
        
        const traders = await Trader.find().select('name bio rating productCount location createdAt');
        res.json(traders);
    } catch (error) {
        next(error);
    }
};

export const getTraderById = async (req, res, next) => {
    try {
        const trader = await Trader.findById(req.params.id).select('-password');
        if (!trader) return res.status(404).json({ message: 'Trader not found' });
        res.json(trader);
    } catch (error) {
        next(error); cmf
    }
};

// Public trader profile including public products (safe for unauthenticated views)
import Product from '../models/Product.js';

export const getTraderPublic = async (req, res, next) => {
    try {
        const traderId = req.params.id;
        const trader = await Trader.findById(traderId).select('name bio rating productCount location createdAt');
        if (!trader) return res.status(404).json({ message: 'Trader not found' });

        // Fetch public product fields for this trader
        const products = await Product.find({ trader: traderId }).select('name price image category quantity unit carbonEmission');

        res.json({ trader, products });
    } catch (error) {
        next(error);
    }
};

// Get current trader's profile (protected)
export const getTraderProfile = async (req, res, next) => {
    try {
        const trader = await Trader.findById(req.user.id).select('-password');
        if (!trader) return res.status(404).json({ message: 'Trader profile not found' });
        res.json(trader);
    } catch (error) {
        next(error);
    }
};

// Update current trader's profile (protected)
export const updateTraderProfile = async (req, res, next) => {
    try {
        const { bio, location, rating } = req.body;
        
        const trader = await Trader.findByIdAndUpdate(
            req.user.id,
            { bio, location, rating },
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!trader) return res.status(404).json({ message: 'Trader not found' });
        res.json(trader);
    } catch (error) {
        next(error);
    }
};
