import express from 'express';
import { getTraders, getTraderById, getTraderPublic, getTraderProfile, updateTraderProfile } from '../controllers/traderController.js';
import { protect } from '../middleware/auth.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public list of traders (only returns non-sensitive public fields)
// Apply a light rate limiter to the public endpoint
router.get('/', rateLimiter({ windowMs: 60_000, maxRequests: 60 }), getTraders);

// Public trader profile (aggregates public trader info + products)
router.get('/:id/public', rateLimiter({ windowMs: 60_000, maxRequests: 60 }), getTraderPublic);

// Protected profile route - get current trader's profile
router.get('/profile', protect, getTraderProfile);

// Protected profile route - update current trader's profile
router.put('/profile', protect, updateTraderProfile);

// Detailed trader data remains protected
router.get('/:id', protect, getTraderById);

export default router;
