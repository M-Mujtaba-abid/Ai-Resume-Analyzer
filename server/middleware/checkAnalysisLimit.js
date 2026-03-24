import ApiError from "../utils/apiErorr.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const checkAnalysisLimit = asyncHandler(async (req, res, next) => {
    const user = req.user;

    // 1. Agar plan expire ho chuka hai (Safety Net)
    if (user.plan !== "free" && user.planExpiry && new Date() > user.planExpiry) {
        // Plan expire ho gaya, isay wapis free par kar dein (Auto-fallback)
        user.plan = "free";
        user.maxLimit = 3;
        await user.save();
        throw new ApiError(403, "Your premium plan has expired. Please renew.");
    }

    // 2. Agar limit khatam ho gayi hai
    if (user.analysisCount >= user.maxLimit) {
        throw new ApiError(403, "Analysis limit reached. Upgrade your plan for more.");
    }

    next();
});