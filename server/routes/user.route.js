import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, forgotPassword, resetPassword, verifyEmail, changeCurrentPassword, generateAccessAndRefreshTokens, googleAuthCallback } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import passport from "passport";

const router = Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/refreshAccessToken",refreshAccessToken);
router.post("/forgotPassword",forgotPassword);
router.post("/resetPassword/:token", resetPassword);
router.post("/verifyEmail", verifyEmail);
router.post("/changeCurrentPassword", verifyJWT, changeCurrentPassword);
router.post("/logout", verifyJWT, logoutUser);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// 2. Google Callback (Jahan Google wapas bhejega)
router.get("/google/back",
    passport.authenticate("google", { session: false, failureRedirect: "/login" }),
    googleAuthCallback // Clean controller call
);;

export default router;