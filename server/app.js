import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import passport from 'passport';
import "./config/passport.js";

// Routes & Middlewares
import userRouter from './routes/user.route.js'
import resumeRouter from './routes/resume.route.js'
import stripeRouter from './routes/stripe.route.js'
import { errorHandler } from './middleware/error.middleware.js';
import { stripeWebhook } from './webhooks/stripe.webhook.js';

const app = express();

// 1. Origins ko clean list mein rakhein
const allowedOrigins = [
  "http://localhost:3000",
  "https://ai-resume-analyzer-frontend-0078.vercel.app"|| process.env.FRONTEND_URL,
  // "https://ai-resume-analyzer-orpin-gamma.vercel.app" // Error wala URL add kiya
];

console.log("url from app cors",allowedOrigins[1])
// 2. CORS Middleware - Isse SABSE UPAR rakhein
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("CORS Blocked for:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));

// 3. Pre-flight requests handler
app.options("(.*)", cors());

// 4. Stripe Webhook (Raw body ke liye express.json se pehle)
app.post("/webhook", express.raw({ type: 'application/json' }), stripeWebhook);

// 5. Normal Parsers
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// 6. Routes
app.use("/user", userRouter);
app.use("/resume", resumeRouter);
app.use("/stripe", stripeRouter);

app.get('/', (req, res) => {
    res.send('API is live! 🚀');
});

app.use(errorHandler);

export default app;