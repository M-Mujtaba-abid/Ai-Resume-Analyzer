import dotenv from 'dotenv';
dotenv.config();
import app from './app.js'; // .js likhna mat bhoolna
import connectDB from './config/db.js';
import configurePassport from './config/passport.js';


const PORT = process.env.PORT ;

connectDB()

configurePassport(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});