import express from 'express';
import { protect } from '../middleware/auth.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { getTraderAnalytics, getAllAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

// Trader analytics (protected)
router.get('/my', protect, rateLimiter({ windowMs: 60_000, maxRequests: 60 }), getTraderAnalytics);

// Admin analytics (protected)
router.get('/', protect, rateLimiter({ windowMs: 60_000, maxRequests: 60 }), getAllAnalytics);

export default router;
