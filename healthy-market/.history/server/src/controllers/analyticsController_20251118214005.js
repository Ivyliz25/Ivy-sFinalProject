import Analytics from '../models/Analytics.js';

// Get analytics for the logged-in trader
export const getTraderAnalytics = async (req, res, next) => {
  try {
    const traderId = req.user._id; // from protect middleware
    const analytics = await Analytics.find({ trader: traderId }).sort({ date: 1 });
    res.status(200).json(analytics);
  } catch (err) {
    console.error('Error in getTraderAnalytics:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all analytics for admin
export const getAllAnalytics = async (req, res, next) => {
  try {
    const analytics = await Analytics.find().sort({ date: 1 });
    res.status(200).json(analytics);
  } catch (err) {
    console.error('Error in getAllAnalytics:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
