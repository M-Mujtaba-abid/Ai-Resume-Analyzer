import { api } from "./api";
import { 
  CheckoutSessionRequest, 
  CheckoutSessionResponse, 
  CustomerPortalResponse, 
  PaymentRecord, 
  UserProfileResponse
} from "../types/stripeTypes";

export const createCheckoutSession = async (data: CheckoutSessionRequest): Promise<CheckoutSessionResponse> => {
  const res = await api.post("/stripe/create-checkout", data);
  return res.data;
};

export const createCustomerPortal = async (): Promise<CustomerPortalResponse> => {
  const res = await api.post("/stripe/create-customer-portal");
  return res.data;
};

export const getPaymentHistory = async (): Promise<PaymentRecord[]> => {
  const res = await api.get("/stripe/get-my-payment");
  return res.data.data;
};


