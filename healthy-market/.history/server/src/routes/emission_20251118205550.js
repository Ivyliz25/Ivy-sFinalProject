// routes/emissions.js
import express from 'express';
import { addEmissionLog, getMyEmissions, getAllEmissions } from '../controllers/emissionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Trader: add a new emission log
router.post('/', protect, addEmissionLog);

// Trader: get their own emissions
router.get('/my', protect, getMyEmissions);

// Admin: get all emissions (optional, you can add admin middleware if needed)
router.get('/', protect, getAllEmissions);

export default router;
