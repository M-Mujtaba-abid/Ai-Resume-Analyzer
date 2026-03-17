import express from 'express';
import userRouter from './routes/user.route.js'
import resumeRouter from './routes/resume.route.js'
import { errorHandler } from './middleware/error.middleware.js';
import cookieParser from 'cookie-parser';
import "./config/passport.js";
import passport from 'passport';
// import configurePassport from './config/passport.js';
const app = express();
import cors from "cors";



app.use(cors({
  origin: "http://localhost:3000" || "https://ai-resume-analyzer-j4if.vercel.app/", // Frontend URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use("/user", userRouter);
app.use("/resume", resumeRouter);

// configurePassport()
app.get('/', (req, res) => {
    res.send('ES6 Import/Export working! 🚀');
});

app.use(errorHandler);
// Default export
export default app;