
import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../config/db.js';
import initCronJobs from '../jobs/resetLimits.js';
import configurePassport from '../config/passport.js';
import app from '../app.js';



let isInitialized = false;

export default async function handler(req, res) {
    try {
        await connectDB(); // 🔥 har request pe ensure connection

        if (!isInitialized) {
            configurePassport(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
            initCronJobs();
            isInitialized = true;
        }

        return app(req, res); // express app handle karega
    } catch (error) {
        console.error("❌ SERVER ERROR:", error);
        res.status(500).json({ message: error.message });
    }
}