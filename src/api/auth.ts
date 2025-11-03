import type {
  RegistrationRequest,
  RegistrationResponse,
} from "@/types/api/auth";
import apiClient from "./apiClinet";

export const registerUser = async ({
  username,
  password,
  email,
}: RegistrationRequest): Promise<RegistrationResponse> => {
  try {
    const res = await apiClient.post("/signup", {
      email,
      username,
      password,
    });

    const data = res.data;
    if (!data) throw new Error("error registration the user");
    return {
      token: data.token,
      user: data.user,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error(String(err));
  }
};
