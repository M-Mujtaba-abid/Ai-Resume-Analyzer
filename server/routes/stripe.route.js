import { Router } from "express";
// import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { createCheckoutSession } from "../controllers/payment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { cancelSubscription, createCheckoutSession, createCustomerPortal, getMyPayments } from "../controllers/stripe.controller.js";

const router = Router();

// Route ko secure karne ke liye verifyJWT zaroori he
router.post("/create-checkout",verifyJWT, createCheckoutSession);
router.post("/create-customer-portal",verifyJWT, createCustomerPortal);
router.get("/get-my-payment",verifyJWT, getMyPayments);
router.get("/cancel-subscription",verifyJWT, cancelSubscription);


export default router;