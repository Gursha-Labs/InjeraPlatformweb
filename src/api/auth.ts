import type {
  LoginRequest,
  LoginResponse,
  RegistrationRequest,
  RegistrationResponse,
  VarifyEmailRequest,
  VarifyEmailResponse,
} from "@/types/api/auth";
import apiClient from "./apiClinet";

export const registerUser = async ({
  username,
  password,
  email,
  type,
}: RegistrationRequest): Promise<RegistrationResponse> => {
  try {
    const res = await apiClient.post("/register", {
      email,
      username,
      password,
      type,
    });

    const data = res.data;
    if (!data) throw new Error("error registration the user");
    return {
      message: data.message,
      user: data.user,
      requires_verification: data.requires_verification,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }

    throw new Error(String(err));
  }
};

export const varifyEmail = async ({
  email,
  otp,
}: VarifyEmailRequest): Promise<VarifyEmailResponse> => {
  try {
    const res = await apiClient.post("/verify-email", {
      email,
      otp,
    });
    const data = res.data;
    if (!data) throw new Error("please enter the correct otp ");

    return {
      message: data.message,
      user: data.user,
      token: data.token,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error(String(err));
  }
};

export const login = async ({
  login,
  password,
}: LoginRequest): Promise<LoginResponse> => {
  try {
    const res = await apiClient.post("/login", {
      login,
      password,
    });

    if (res.status === 403) throw new Error("Please verify your email");

    const data = res.data;

    if (!data) throw new Error("Invalid Creadental ");

    return {
      user: data.user,
      message: data.message,
      token: data.token,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error(String(err));
  }
};

export const forgotPassword = async ({ email }: { email: string }) => {
  try {
    const res = await apiClient.post("/forgot-password", {
      email,
    });
    const data = res.data;
    if (!data) throw new Error("please enter valid email");
    return {
      message: data.message,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error(String(err));
  }
};
interface ResetPasswordParam {
  password: string;
  conformpassword: string;
  otp: string;
  email: string;
}

export const resetPassword = async ({
  password,
  conformpassword,
  otp,
  email,
}: ResetPasswordParam) => {
  try {
    const res = await apiClient.post("/reset-password", {
      email,
      password,
      password_confirmation: conformpassword,
      otp,
    });
    const data = res.data;

    if (!data) throw new Error("something went Wrong");

    return {
      message: data.message,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error(String(err));
  }
};
