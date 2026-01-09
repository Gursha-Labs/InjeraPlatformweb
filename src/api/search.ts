import apiClient from "./apiClinet"
import {handleApiResponse} from "./../lib/handleApiResponse"
import type { FetchAdsResponse } from "@/types/api/ad";

export const fetchsearchpagead=()=>{
 return handleApiResponse<FetchAdsResponse>(() =>
    apiClient.get("/ads/feed", {
      params: {
        page: 1,
      },
    })
  );
}
