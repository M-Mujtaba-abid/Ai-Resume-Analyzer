import cron from "node-cron";
import User from "../models/user.model.js";

// Ye function har raat 12 baje (00:00) chalega
const initCronJobs = () => {
    // Syntax: minute hour day-of-month month day-of-week
    // cron.schedule("*/1 * * * *", async () => {
    cron.schedule("0 0 * * *", async () => {
        try {
            console.log("-----------------------");
            console.log("Running Daily Limit Reset Job...");
            
            // Sab users ka count 0 kar do jinka plan 'free' hai
            // Agar aap silver/gold ka bhi reset chahte hain toh filter hata dein
            const result = await User.updateMany(
                { plan: "free" }, 
                { $set: { analysisCount: 0 } } 
            );

            console.log(`✅ Daily limits reset for ${result.modifiedCount} users.`);
            console.log("-----------------------");
        } catch (error) {
            console.error("❌ Cron Job Error:", error.message);
        }
    });
};

export default initCronJobs;