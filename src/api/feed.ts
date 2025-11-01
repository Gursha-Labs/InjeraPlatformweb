import apiClient from "./apiClinet";

import type { FetchAdsResponse, AdVideo } from "@/types/api/ad";

interface FetchVideosParams {
  pageParam?: number;
}

interface FetchVideosResult {
  videos: AdVideo[];
  nextPage: number;
  hasMore: boolean;
}

export const fetchVideos = async ({
  pageParam = 1,
}: FetchVideosParams): Promise<FetchVideosResult> => {
  try {
    const res = await apiClient.get<FetchAdsResponse>(
      `/feed?page=${pageParam}`
    );

    const data = res.data;
    if (!data?.data) throw new Error("Invalid API response structure");

    return {
      videos: data.data,
      nextPage: data.hasNextPage ? pageParam + 1 : pageParam,
      hasMore: data.hasNextPage,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error(String(err));
  }
};
