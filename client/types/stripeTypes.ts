export interface CheckoutSessionRequest {
  planType: "silver" | "gold";
}

export interface CheckoutSessionResponse {
  statusCode: number;
  data: {
    url: string;
  };
  message: string;
  success: boolean;
}

export interface CustomerPortalResponse {
  statusCode: number;
  data: {
    url: string;
  };
  message: string;
  success: boolean;
}

export interface PaymentRecord {
  _id: string;
  amount: number;
  currency: string;
  status: "succeeded" | "pending" | "failed";
  planType: string;
  createdAt: string;
  receiptUrl?: string;
}

// types/stripeTypes.ts mein add karein
export interface UserProfileResponse {
  statusCode: number;
  data: {
    _id: string;
    name: string;
    email: string;
    plan: "free" | "silver" | "gold";
    planExpiry?: string;
    analysisCount: number;
    maxLimit: number;
  };
  success: boolean;
}