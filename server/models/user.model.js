import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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
      select: false,
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

// --- DRY: Password Hashing Middleware ---
// Jab bhi password save ya modify hoga, ye khud hi hash kar dega
userSchema.pre("save", async function (next) {
    // Agar password change nahi hua ya hai hi nahi (Google user), toh skip karo
    if (!this.isModified("password") || !this.password) {
        return 
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
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  });
};

export default mongoose.model("User", userSchema);
