import { handleApiResponse } from "@/lib/handleApiResponse";
import apiClient from "./apiClinet";

import type { FetchAdsResponse } from "@/types/api/ad";
import type { AdVideo } from "@/types/models/adVideo";

export const postAdFeed = async (data: AdVideo) => {
  return handleApiResponse(() => apiClient.post("/ads/upload", data));
};

export const fetchAdFeed = async ({ pageParam = 1 }) => {
  return handleApiResponse<FetchAdsResponse>(() =>
    apiClient.get("/ads/feed", {
      params: {
        page: pageParam,
      },
    })
  );
};
