import express from 'express';
import { protect, trader, admin } from '../middleware/auth.js'; 

const router = express.Router();

// Public routes
router.get('/', async (req, res) => {
    
});

// Protected routes
router.use(protect);

router.post('/', trader, async (req, res) => {
   
});

router.put('/:id', trader, async (req, res) => {
   
});

export default router;