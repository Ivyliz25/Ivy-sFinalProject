// routes/waste.js
import express from 'express';
import { addWasteLog, getMyWasteLogs, getAllWasteLogs } from '../controllers/wasteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Trader: add new waste log
router.post('/', protect, addWasteLog);

// Trader: get their own waste logs
router.get('/my', protect, getMyWasteLogs);

// Admin: get all waste logs (optional)
router.get('/', protect, getAllWasteLogs);

export default router;
