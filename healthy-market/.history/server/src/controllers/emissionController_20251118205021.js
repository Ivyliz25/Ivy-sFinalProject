import EmissionLog from '../models/EmissionLog.js';
import Trader from '../models/Trader.js';

// Add a new emission log
export const addEmissionLog = async (req, res, next) => {
    try {
        const { product, activityType, carbonEmission, notes } = req.body;

        const newLog = new EmissionLog({
            trader: req.user.id,
            product: product || null,
            activityType,
            carbonEmission,
            notes
        });

        const savedLog = await newLog.save();
        res.status(201).json(savedLog);
    } catch (error) {
        next(error);
    }
};

// Get all emission logs for current trader
export const getMyEmissions = async (req, res, next) => {
    try {
        const logs = await EmissionLog.find({ trader: req.user.id })
            .populate('product', 'name price')
            .sort({ date: -1 });
        res.json(logs);
    } catch (error) {
        next(error);
    }
};

// Admin: get all emissions (optional)
export const getAllEmissions = async (req, res, next) => {
    try {
        const logs = await EmissionLog.find()
            .populate('trader', 'name email')
            .populate('product', 'name price')
            .sort({ date: -1 });
        res.json(logs);
    } catch (error) {
        next(error);
    }
};
