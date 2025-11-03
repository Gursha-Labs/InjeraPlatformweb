import type { User } from "../models/user";

export interface RegistrationRequest {
  username: string;
  email: string;
  password: string;
}
export interface RegistrationResponse {
  token: string;
  user: User;
}
