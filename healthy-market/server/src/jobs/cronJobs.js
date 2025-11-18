import cron from 'node-cron';
import WasteLog from '../models/WasteLog.js';
import EmissionLog from '../models/EmissionLog.js';
import { calculateCarbonEmission } from '../utils/emissionCalc.js';

export const setupCronJobs = () => {
    try {
        // Run every day at midnight
        cron.schedule('0 0 * * *', async () => {
            console.log('Running daily emission calculation...');
            const wasteLogs = await WasteLog.find();
            for (const log of wasteLogs) {
                const emission = calculateCarbonEmission(log.wasteKg);
                await EmissionLog.create({ trader: log.trader, emissionKg: emission });
            }
        });
        console.log('Cron jobs setup complete');
    } catch (error) {
        console.error('Error setting up cron jobs:', error);
    }
};
