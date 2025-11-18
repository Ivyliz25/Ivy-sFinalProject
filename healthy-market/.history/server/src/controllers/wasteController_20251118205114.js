
import WasteLog from '../models/WasteLog.js';

// Add a new waste log
export const addWasteLog = async (req, res, next) => {
    try {
        const { wasteType, quantity, notes } = req.body;

        const newLog = new WasteLog({
            trader: req.user.id,
            wasteType,
            quantity,
            notes
        });

        const savedLog = await newLog.save();
        res.status(201).json(savedLog);
    } catch (error) {
        next(error);
    }
};

// Get all waste logs for current trader
export const getMyWasteLogs = async (req, res, next) => {
    try {
        const logs = await WasteLog.find({ trader: req.user.id }).sort({ date: -1 });
        res.json(logs);
    } catch (error) {
        next(error);
    }
};

// Admin: get all waste logs
export const getAllWasteLogs = async (req, res, next) => {
    try {
        const logs = await WasteLog.find().populate('trader', 'name email').sort({ date: -1 });
        res.json(logs);
    } catch (error) {
        next(error);
    }
};
