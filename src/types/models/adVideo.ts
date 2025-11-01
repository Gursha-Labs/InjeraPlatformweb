import type { User } from "./user";

export type Category = {
  id: string;
  name: string;
};
export type AdVideo = {
  id: string;
  advertiser: User;
  title: string;
  description: string;
  duration: number;
  video_url: string;
  view_count: number;
  comment_count: number;
  category: Category;
  tags: string[];
  is_active: boolean;
};
