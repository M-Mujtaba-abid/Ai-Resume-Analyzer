import { UserProfileResponse } from "@/types/userType";
import { api } from "./api"; // Aapki main file jahan axios instance hai



export const getCurrentUserProfile = async (): Promise<UserProfileResponse> => {
  const res = await api.get("/user/getCurrentUser"); // Backend route: router.route("/me").get(verifyJWT, getCurrentUser)
  return res.data;
};

/**
 * Agar aapko sirf plan update check karna ho (Optional)
 */
export const checkSubscriptionStatus = async (): Promise<{ plan: string; success: boolean }> => {
  const res = await api.get("/user/getCurrentUser");
  return {
    plan: res.data.data.plan,
    success: res.data.success
  };
};