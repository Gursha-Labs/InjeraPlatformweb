import type {
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  RegistrationResponse,
  ResetPasswordParam,
  VarifyEmailRequest,
  VarifyEmailResponse,
} from "@/types/api/auth";
import apiClient from "./apiClinet";
import { handleApiResponse } from "@/lib/handleApiResponse";

export const registerUser = async ({
  username,
  password,
  email,
  type,
}: RegistrationRequest) => {
  return handleApiResponse<RegistrationResponse>(() =>
    apiClient.post("/register", {
      email,
      username,
      password,
      type,
    })
  );
};

export const varifyEmail = async ({ email, otp }: VarifyEmailRequest) => {
  return handleApiResponse<VarifyEmailResponse>(() =>
    apiClient.post("/verify-email", {
      email,
      otp,
    })
  );
};

export const login = async ({ login, password }: LoginRequest) => {
  return handleApiResponse<LoginResponse>(() =>
    apiClient.post("/login", {
      login,
      password,
    })
  );
};

export const forgotPassword = async ({ email }: { email: string }) => {
  return handleApiResponse(() =>
    apiClient.post("/forgot-password", {
      email,
    })
  );
};

export const resetPassword = async ({
  password,
  conformpassword,
  otp,
  email,
}: ResetPasswordParam) => {
  return handleApiResponse(() =>
    apiClient.post<ResetPasswordParam>("/reset-password", {
      email,
      password,
      password_confirmation: conformpassword,
      otp,
    })
  );
};
