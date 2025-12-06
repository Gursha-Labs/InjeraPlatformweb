import { handleApiResponse } from "@/lib/handleApiResponse";
import apiClient from "./apiClinet";

import type { FetchAdsResponse } from "@/types/api/ad";

export const postAdFeed = async (data: FormData) => {
  return handleApiResponse(() =>
    apiClient.post("/ads/upload", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );
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
