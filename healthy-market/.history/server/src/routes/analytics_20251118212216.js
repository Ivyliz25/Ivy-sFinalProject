import express from 'express';
import { protect } from '../middleware/auth.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { getTraderAnalytics, getAllAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

// Trader analytics
router.get('/trader', protect, rateLimiter({ windowMs: 60_000, maxRequests: 60 }), getTraderAnalytics);

// Admin analytics
router.get('/all', protect, rateLimiter({ windowMs: 60_000, maxRequests: 60 }), getAllAnalytics);

export default router;

router.get('/my', getTraderAnalytics); // /api/analytics/my
router.get('/', getAnalytics);         // /api/analytics
