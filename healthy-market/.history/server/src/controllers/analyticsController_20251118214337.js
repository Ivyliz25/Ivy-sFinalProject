import WasteLog from '../models/WasteLog.js';
import EmissionLog from '../models/EmissionLog.js';

export const getAnalytics = async (req, res, next) => {
    try {
        const emissions = await EmissionLog.find();
        res.json(emissions.map(e => ({ date: e.date, emission: e.emissionKg })));
    } catch (error) {
        next(error);
    }
};
