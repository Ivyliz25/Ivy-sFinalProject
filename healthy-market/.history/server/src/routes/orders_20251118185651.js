import express from 'express';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js'; 

const router = express.Router();

// Apply protect middleware to all order routes
router.use(protect);

// Create new order
router.post('/', async (req, res) => {
    try {
        const order = new Order({
            ...req.body,
            customer: req.user.id,
            orderNumber: 'ORD' + Date.now()
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(400).json({ message: 'Error creating order', error: error.message });
    }
});

// Get user's orders
router.get('/my-orders', async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user.id })
            .populate('items.trader')
            .sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

export default router;