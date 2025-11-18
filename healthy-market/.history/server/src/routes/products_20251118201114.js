import express from 'express';
import { getProducts, getMyProducts, createProduct, deleteProduct } from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.get('/', getProducts);
router.get('/my-products', protect, getMyProducts);
router.post('/', protect, createProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
