import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { stripe } from "../services/stripe.service.js";
import ApiError from "../utils/apiErorr.js";
import paymentSchema from "../models/payment.model.js";
import userModel from "../models/user.model.js";

const createCheckoutSession = asyncHandler(async (req, res) => {
  const { planType } = req.body;
  const userId = req.user?._id; // Auth middleware se user ID mil rahi he
  console.log("plan type === ", planType);
  // 1. Validation
  if (!planType || !["silver", "gold"].includes(planType)) {
    throw new ApiError(400, "Invalid plan type. Please select Silver or Gold.");
  }

  if (!userId) {
    throw new ApiError(401, "Unauthorized: Please login to upgrade.");
  }

  // 2. Stripe Price IDs (Ye aapke dashboard se milengi)
  const priceIds = {
    silver: process.env.STRIPE_SILVER_PRICE_ID, // e.g., 'price_1Q...'
    gold: process.env.STRIPE_GOLD_PRICE_ID, // e.g., 'price_1R...'
  };

  console.log("price id", priceIds);
  try {
    // 3. Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceIds[planType],
          quantity: 1,
        },
      ],
      mode: "subscription", // Recurring payment ke liye
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      client_reference_id: userId.toString(), // Database update ke liye important he
      metadata: {
        planType: planType,
      },
      customer_email: req.user?.email, // Stripe checkout page pe email pehle se likha ayega
    });

    if (!session) {
      throw new ApiError(500, "Stripe session creation failed");
    }

    // 4. Return success response with URL
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { url: session.url },
          "Checkout session created successfully",
        ),
      );
  } catch (error) {
    throw new ApiError(500, error?.message || "Internal Stripe Error");
  }
});

// stripe.controller.js

const createCustomerPortal = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user?._id);

  if (!user?.stripeCustomerId) {
    throw new ApiError(
      400,
      "No active billing record found. Please subscribe first.",
    );
  }

  // Stripe Portal Session create karein
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.FRONTEND_URL}/`, // Portal se wapas kahan aana hai
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { url: portalSession.url },
        "Customer portal link generated",
      ),
    );
});

const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await paymentSchema
    .find({ user: req.user._id })
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, payments, "Payment history fetched successfully"),
    );
});


// isko use ni kiya abhi kiu ke ye customer portal pr mil rha he 
const cancelSubscription = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);

  if (!user.subscriptionId) {
    throw new ApiError(400, "No active subscription found");
  }

  // Stripe par subscription cancel karein (period ke end par)
  const deletedSubscription = await stripe.subscriptions.update(
    user.subscriptionId,
    {
      cancel_at_period_end: true,
    },
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedSubscription,
        "Subscription will be cancelled at the end of billing period",
      ),
    );
});

export { createCheckoutSession, getMyPayments, createCustomerPortal ,cancelSubscription};
