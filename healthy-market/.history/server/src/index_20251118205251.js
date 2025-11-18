import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import traderRoutes from './routes/traders.js';
import productRoutes from './routes/products.js';
import analyticsRoutes from './routes/analytics.js';
import { errorHandler } from './middleware/errorHandler.js';
import { setupCronJobs } from './jobs/cronJobs.js';
import emissionsRouter from './routes/emissions.js';
import wasteRouter from './routes/waste.js';

// ...

app.use('/api/emissions', emissionsRouter);
app.use('/api/waste', wasteRouter);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });
const app = express();

// CORS configuration - allow localhost on any port for development
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Welcome to Ivy's Healthy Market API!");
});

app.use('/api/auth', authRoutes);
app.use('/api/traders', traderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use(errorHandler);

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in .env file');
    process.exit(1);
}

mongoose.connect(MONGO_URI)
.then(() => {
    console.log('MongoDB connected');
    setupCronJobs();
    console.log('Cron jobs setup complete');
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Server is alive and listening. You can access it at http://localhost:${PORT}`);
    });
    
    server.on('error', (err) => {
        console.error('Server error:', err);
    });
    
    server.on('close', () => {
        console.log('Server closed');
    });
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
