import EmissionLog from '../models/EmissionLog.js';
import WasteLog from '../models/WasteLog.js';

// Trader: own emissions & waste
export const getTraderAnalytics = async (req, res, next) => {
    try {
        const traderId = req.user.id;
        const emissions = await EmissionLog.find({ trader: traderId });
        const waste = await WasteLog.find({ trader: traderId });

        // combine emissions & waste by index
        const data = emissions.map((e, i) => ({
            date: e.date,
            emissionKg: e.kg,
            wasteKg: waste[i]?.kg || 0
        }));

        res.json(data);
    } catch (err) {
        next(err);
    }
};

// Admin: all traders
export const getAllAnalytics = async (req, res, next) => {
    try {
        const emissions = await EmissionLog.find().populate('trader', 'name email');
        const waste = await WasteLog.find().populate('trader', 'name email');

        const data = emissions.map(e => {
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
    } catch (err) {
        next(err);
    }
};
