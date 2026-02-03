import API from "./api";

export const loginUser = (data: { email: string; password: string }) => {
  return API.post("/auth/login", data);
};

export const registerUser = (data: { email: string; password: string }) => {
  return API.post("/auth/register", data);
};

export const verifyEmailOtp = (email: string, otp: string) => {
  return API.post("/auth/verify-otp", { email, otp });
};

export const resendOtp = (email: string) => {
  return API.post("/auth/resend-otp", { email });
};

export const forgotPassword = (email: string) => {
  return API.post("/auth/forgot-password", { email });
};

export const resetPassword = (token: string, password: string) => {
  return API.post(`/auth/reset-password/${token}`, { password });
};




