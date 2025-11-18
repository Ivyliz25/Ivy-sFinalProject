import express from 'express';
import { getTraders, getTraderById, getTraderPublic, getTraderProfile, updateTraderProfile } from '../controllers/traderController.js';
import { protect, admin } from '../middleware/auth.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', rateLimiter({ windowMs: 60_000, maxRequests: 60 }), getTraders);

router.get('/:id/public', rateLimiter({ windowMs: 60_000, maxRequests: 60 }), getTraderPublic);

router.get('/profile', protect, getTraderProfile);


router.put('/profile', protect, updateTraderProfile);

router.get('/:id', protect, getTraderById);

router.use(protect);


router.get('/', async (req, res) => {
    try {
       
        res.json({ message: 'Traders route' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/', admin, async (req, res) => {
    try {
        
        res.json({ message: 'Trader created' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
