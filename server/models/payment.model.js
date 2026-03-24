import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stripeSessionId: { type: String, required: true },
    stripeCustomerId: { type: String, required: true },
    subscriptionId: { type: String },
    amount: { type: Number, required: true },
    // payment.model.js
    currency: { type: String, uppercase: true, default: "PKR" },
    status: {
      type: String,
      enum: ["succeeded", "pending", "failed"],
      required: true,
    },
    planType: { type: String, enum: ["silver", "gold"], required: true },
    receiptUrl: { type: String }, // Jo Stripe se milta hai
  },
  { timestamps: true },
);

export default mongoose.model("Payment", paymentSchema);
// export default mongoose.model("User", userSchema);