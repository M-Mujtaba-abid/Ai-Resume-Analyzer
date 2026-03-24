import express from 'express';
import userRouter from './routes/user.route.js'
import resumeRouter from './routes/resume.route.js'
import stripeRouter from './routes/stripe.route.js'
import { errorHandler } from './middleware/error.middleware.js';
import cookieParser from 'cookie-parser';
import "./config/passport.js";
import passport from 'passport';
// import configurePassport from './config/passport.js';
const app = express();
import cors from "cors";
import { stripeWebhook } from './webhooks/stripe.webhook.js';
// import { checkAnalysisLimit } from './middleware/checkAnalysisLimit.js';



const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL || "https://ai-resume-analyzer-6p1x.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } 
    console.log("Blocked by CORS:", origin);
    return callback(null, false); // Do not throw error
  },
  credentials: true
}));
app.post("/webhook", express.raw({ type: 'application/json' }), stripeWebhook);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use("/user", userRouter);
app.use("/resume", resumeRouter);
app.use("/stripe", stripeRouter);

// configurePassport()
app.get('/', (req, res) => {
    res.send('ES6 Import/Export working! 🚀');
});

app.use(errorHandler);
// Default export
export default app;