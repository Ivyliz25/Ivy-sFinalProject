import WasteLog from '../models/WasteLog.js';
import EmissionLog from '../models/EmissionLog.js';
import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import { getTraderAnalytics, getAllAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();


export const getAnalytics = async (req, res, next) => {
    try {
        const emissions = await EmissionLog.find();
        res.json(emissions.map(e => ({ date: e.date, emission: e.emissionKg })));
    } catch (error) {
        next(error);
    }
};

// Trader view: only their own emissions/waste
export const getTraderAnalytics = async (req, res, next) => {
    try {
        const traderId = req.user.id;
        const emissions = await EmissionLog.find({ trader: traderId });
        const waste = await WasteLog.find({ trader: traderId });
        res.json(emissions.map((e, i) => ({
            date: e.date,
            emissionKg: e.kg,
            wasteKg: waste[i]?.kg || 0
        })));
    } catch (error) {
        next(error);
    }
};

// Admin view: all traders
export const getAllAnalytics = async (req, res, next) => {
    try {
        const emissions = await EmissionLog.find().populate('trader', 'name email');
        const waste = await WasteLog.find().populate('trader', 'name email');

        const data = emissions.map((e) => {
            const w = waste.find(w => w.trader._id.toString() === e.trader._id.toString());
            return {
                traderName: e.trader.name,
                traderEmail: e.trader.email,
                date: e.date,
                emissionKg: e.kg,
                wasteKg: w?.kg || 0
            };
        });

        res.json(data);
    } catch (error) {
        next(error);
    }
};