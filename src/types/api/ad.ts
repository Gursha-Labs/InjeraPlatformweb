export interface FetchAdsRequest {
  page?: number;
  limit?: number;
  categoryId?: number;
  search?: string;
  advertiserId?: string;
  includeInactive?: boolean;
}
export interface Category {
  id: string;
  name: string;
}

export interface Advertiser {
  id: string;
  username: string;
  email: string;
  avatar: string;
  type: "advertiser";
  website_url?: string;
}

export interface AdVideo {
  id: string;
  title: string;
  description: string;
  video_url: string;
  category: Category;
  tags: string[];
  advertiser: Advertiser;
  duration: number;
  view_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FetchAdsResponse extends PaginationMeta {
  data: AdVideo[];
}
