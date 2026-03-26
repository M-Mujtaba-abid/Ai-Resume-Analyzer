import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      select: false
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    googleId: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    plan: {
      type: String,
      enum: ["free", "silver", "gold"],
      default: "free",
    },
    planExpiry: {
      type: Date,
      default: null, // Free users ke liye null
    },
    stripeCustomerId: String,
    subscriptionId: String,
    analysisCount: {
      type: Number,
      default: 0,
    },
    maxLimit: {
      type: Number,
      default: 3,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationOTP: String,
    emailVerificationExpiry: Date,
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.post("save", async function (doc, next) {
  try {
    if (doc.emailVerificationOTP && !doc.isEmailVerified) {
      sendEmail({
        email: doc.email,
        subject: "Verify Your Email - AI Resume Analyzer",
        html: `
<div style="background:#f4f6fb;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
  <table align="center" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.05);">

    <!-- Header -->
    <tr>
      <td style="background:#2563eb;padding:20px;text-align:center;">
        <h1 style="color:#ffffff;margin:0;font-size:24px;">
          AI Resume <span style="color:#bfdbfe;">Analyzer</span>
        </h1>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:35px;">
        <h2 style="color:#1e293b;margin-top:0;">Email Verification</h2>

        <p style="color:#475569;line-height:1.6;font-size:15px;">
          Thank you for signing up for <strong>AI Resume Analyzer</strong>.
          Please use the verification code below to confirm your email address and activate your account.
        </p>

        <!-- OTP Box -->
        <div style="margin:30px 0;text-align:center;">
          <span style="display:inline-block;padding:15px 30px;background:#eff6ff;border:2px dashed #2563eb;border-radius:10px;font-size:32px;font-weight:bold;letter-spacing:6px;color:#2563eb;">
            ${doc.emailVerificationOTP}
          </span>
        </div>

        <p style="color:#64748b;font-size:14px;">
          This verification code will expire in <strong>10 minutes</strong>.
        </p>

        <p style="color:#94a3b8;font-size:13px;">
          If you did not create an account with AI Resume Analyzer, you can safely ignore this email.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f8fafc;padding:15px;text-align:center;font-size:12px;color:#94a3b8;">
        © 2026 AI Resume Analyzer. All rights reserved.
      </td>
    </tr>

  </table>
</div>
`,
      });
    }

    next();
  } catch (error) {
    console.error("Email Trigger Error:", error);
    next();
  }
});

// --- DRY: Password Hashing Middleware ---
// Jab bhi password save ya modify hoga, ye khud hi hash kar dega
userSchema.pre("save", async function (next) {
  // Agar password change nahi hua ya hai hi nahi (Google user), toh skip karo
  if (!this.isModified("password") || !this.password) {
    return;
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    return next(error);
  }
});
// --- DRY: Password Verification Method ---
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// --- Token Generation Methods ---
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1m" },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  });
};

export default mongoose.model("User", userSchema);
