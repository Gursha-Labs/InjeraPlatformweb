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

export const addVidoeFinshed = async (videoid: string) => {
  return handleApiResponse(() =>
    apiClient.post(`/ads/${videoid}/view`, {
      watched_percentage: "100",
    })
  );
};
export const fetchUserPoints = async () => {
  return handleApiResponse<{ points: number }>(() =>
    apiClient.get("/user/points")
  );
};

export const postComment = async ({
  comment,
  videoid,
}: {
  comment: string;
  videoid: string;
}) => {
  return handleApiResponse(() =>
    apiClient.post(` ads/${videoid}/comment`, {
      comment,
    })
  );
};
