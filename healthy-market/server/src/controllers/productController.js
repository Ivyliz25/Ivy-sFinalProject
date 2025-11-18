import Product from '../models/Product.js';

export const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find().populate('trader', 'name');
        res.json(products);
    } catch (error) {
        next(error);
    }
};

export const getMyProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ trader: req.user.id });
        res.json(products);
    } catch (error) {
        next(error);
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const product = await Product.create({ ...req.body, trader: req.user.id });
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        
        // Check if user is the product's trader or is an admin
        if (product.trader.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }
        
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};
