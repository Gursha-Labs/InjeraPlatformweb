export type UserType = "admin" | "user" | "advertiser";

export type User = {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  type: UserType;
  website_url?: string;
};
