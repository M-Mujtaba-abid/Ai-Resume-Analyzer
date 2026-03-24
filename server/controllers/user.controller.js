import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiResponse } from "../utils/apiResponse.js";
import ApiError from "../utils/apiErorr.js";
import User from "../models/user.model.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";

// Helper function (Internal use only)
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("TOKEN_GEN_ERROR:", error);
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

// const registerUser = asyncHandler(async (req, res) => {

//   const { name, email, password } = req.body;

//   // Check if user exists
//   const existedUser = await User.findOne({ email });
//   if (existedUser) throw new ApiError(409, "User already exists");

//   // 1. Generate 6-digit OTP
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins valid

//   // 2. Create User (unverified)
//   const user = await User.create({
//     name,
//     email,
//     password,
//     emailVerificationOTP: otp,
//     emailVerificationExpiry: otpExpiry,
//   });

//   // 3. Send Email
//   try {
//     await sendEmail({
//       email: user.email,
//       subject: "Email Verification Code",
//       message: `Aapka verification code ye hai: ${otp}. Ye 10 minute mein expire ho jayega.`,
//     });
//   } catch (error) {
//     console.error("Email Error:", error);
//     // User delete karne ki zaroorat nahi, baad mein resend OTP ka option de sakte hain
//   }

//   return res
//     .status(201)
//     .json(
//       new ApiResponse(
//         201,
//         { email: user.email },
//         "Registration successful. Please check your email for OTP.",
//       ),
//     );
// });

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existedUser = await User.findOne({ email });
  if (existedUser) throw new ApiError(409, "User already exists");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = Date.now() + 10 * 60 * 1000;

  // Sirf create karein, email Model ka post-save hook khud bhej dega
  const user = await User.create({
    name,
    email,
    password,
    emailVerificationOTP: otp,
    emailVerificationExpiry: otpExpiry,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { email: user.email },
        "Registration successful. OTP has been sent to your email.",
      ),
    );
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) throw new ApiError(400, "Email and OTP are required");

  const user = await User.findOne({
    email,
    emailVerificationOTP: otp,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // Update user status
  user.isEmailVerified = true;
  user.emailVerificationOTP = undefined; // Clear OTP after use
  user.emailVerificationExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Email verified successfully. You can now login.",
      ),
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, "Credentials required");

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(404, "User not found");
  // Check if email is verified
  if (!user.isEmailVerified) {
    throw new ApiError(403, "Please verify your email first.");
  }

  // DRY: Model method used here
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false }); // DB mein save karna lazmi hai

  const options = {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    // sameSite: "None",
    secure: false,
    sameSite: "lax",
    path: "/",
  };

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "Login success",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  if (req.user?._id) {
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: true },
    );
  }

  // Same options jo login ke waqt use kiye thay wahi yahan use karein
  const options = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ success: true, message: "Logged out" }); // Direct JSON for testing
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken;
  // console.log("incomingToken from user controller 193line",incomingToken )
  if (!incomingToken) throw new ApiError(401, "Unauthorized request");

  try {
    const decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
    // console.log("decoded", decoded)
    const user = await User.findById(decoded?._id).select("+refreshToken");
    // console.log("user refresh token" , user )
    if (!user || incomingToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .cookie("accessToken", accessToken, { httpOnly: true })
      .cookie("refreshToken", newRefreshToken, { httpOnly: true })
      .json(new ApiResponse(200, { accessToken }, "Token refreshed"));
  } catch (error) {
    console.log("Actual Error:", error.message);
    throw new ApiError(401, "Invalid refresh token");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(400, "Token invalid or expired");

  // DRY: Direct password assign karein, Pre-save hook isse hash kar dega
  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  await user.save();

  res.status(200).json(new ApiResponse(200, {}, "Password reset success"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // 1. User ko dhoondo

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "can't find user with this email");
  }

  // 2. Secret Token banayein

  const resetToken = crypto.randomBytes(20).toString("hex");

  // 3. Token ko hash karke aur expiry (15 min) DB mein save karein

  user.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  // 4. Link banayein

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `Aapka password reset link ye hai: \n\n ${resetUrl} \n\n Ye link 15 minute mein expire ho jayega.`;

  try {
    await sendEmail({
      email: user.email,

      subject: "Password Reset Request",

      message,
    });

    console.log("mail send to ", user.email);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "Email bhej di gayi hai. Apna inbox check karein.",
        ),
      );
  } catch (error) {
    console.log("EMAIL ERROR DETAILS:", error);

    // Agar email na jaye to DB se token clear kar dein

    user.forgotPasswordToken = undefined;

    user.forgotPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    throw new ApiError(
      500,
      "Email bhejne mein masla hua. Baad mein koshish karein.",
    );
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Both old and new passwords are required");
  }

  // 1. User ko dhoondo (req.user verifyJWT middleware se aayega)
  const user = await User.findById(req.user?._id).select("+password");

  // 2. Purana password check karo (Model method use karke)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Purana password galat hai");
  }

  // 3. Naya password assign karo
  user.password = newPassword;

  // 4. Save karo (Pre-save hook khud hash kar dega)
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password successfully change ho gaya hai"));
});

const googleAuthCallback = asyncHandler(async (req, res) => {
  // 1. Tokens generate karein (req.user passport se aata hai)
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    req.user._id,
  );

  // 2. Cookie options set karein
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",
  };

  // 3. Cookies set karke redirect karein
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .redirect(`${frontendUrl}/`);
});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  resetPassword,
  forgotPassword,
  verifyEmail,
  changeCurrentPassword,
  generateAccessAndRefreshTokens,
  googleAuthCallback,
};
