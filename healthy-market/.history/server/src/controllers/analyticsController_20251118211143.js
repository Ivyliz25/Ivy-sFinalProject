import EmissionLog from '../models/EmissionLog.js';
import WasteLog from '../models/WasteLog.js';

// Admin: get all emissions & waste
export const getAllAnalytics = async (req, res, next) => {
  try {
    const emissions = await EmissionLog.find();
    const waste = await WasteLog.find();

    // Merge by date or whatever analytics you need
    const analytics = emissions.map(e => {
      const w = waste.find(w => w.date.toISOString() === e.date.toISOString());
      return {
        date: e.date,
        emissionKg: e.kg,
        wasteKg: w?.kg || 0
      };
    });

    res.json(analytics);
  } catch (err) {
    next(err);
  }
};

// Trader: get own emissions & waste
export const getTraderAnalytics = async (req, res, next) => {
  try {
    const traderId = req.user.id;
    const emissions = await EmissionLog.find({ trader: traderId });
    const waste = await WasteLog.find({ trader: traderId });

    const analytics = emissions.map(e => {
      const w = waste.find(w => w.date.toISOString() === e.date.toISOString());
      return {
        date: e.date,
        emissionKg: e.kg,
        wasteKg: w?.kg || 0
      };
    });

    res.json(analytics);
  } catch (err) {
    next(err);
  }
};
