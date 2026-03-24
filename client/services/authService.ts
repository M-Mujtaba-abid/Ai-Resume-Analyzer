// import axios from "axios";
import {
  RegisterRequest,
  LoginRequest,
  VerifyOtpRequest,
  AuthResponse,
  ResetPasswordRequest,
  ForgotPasswordRequest,
  // logoutUser,
  changecurrentpassword
} from "@/types/authTypes";
import { api, API_URL } from "./api";

// const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });





export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post("/user/login", data, { withCredentials: true });
  return response.data;
};
export const logout = async (): Promise<AuthResponse> => {
  const response = await api.post("/user/logout", {}, { withCredentials: true });
  return response.data;
};
export const forgotPassword = async (
  data: ForgotPasswordRequest
): Promise<AuthResponse> => {
  const response = await api.post("/user/forgotPassword", data ,{ withCredentials: true });
  return response.data;
};

export const resetPassword = async (
  token: string,
  data: ResetPasswordRequest
): Promise<AuthResponse> => {
  const response = await api.post(`/user/resetPassword/${token}`, data,{ withCredentials: true });
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post("/user/register", data,{ withCredentials: true });
  return response.data;
};
export const changeCurrentPassword = async (data: changecurrentpassword): Promise<AuthResponse> => {
  const response = await api.post("/user/changeCurrentPassword", data,{ withCredentials: true });
  return response.data;
};

export const verifyOtp = async (data: VerifyOtpRequest): Promise<AuthResponse> => {
  const response = await api.post("/user/verifyEmail", data,{ withCredentials: true });
  return response.data;
};

export const loginWithGoogle = () => {
  window.location.href = `${API_URL}/user/google`;
};

