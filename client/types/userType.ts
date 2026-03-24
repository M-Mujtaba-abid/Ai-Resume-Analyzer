export interface UserData {
  _id: string;
  name: string;
  email: string;
  googleId?: string;
  avatar?: string;
  role: string;
  plan: "free" | "silver" | "gold";
  planExpiry: string; // ISO Date String
  analysisCount: number;
  maxLimit: number;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  stripeCustomerId?: string;
  subscriptionId?: string;
  __v: number;
}

export interface UserProfileResponse {
  statusCode: number;
  data: UserData;
  message: string;
  success: boolean;
}