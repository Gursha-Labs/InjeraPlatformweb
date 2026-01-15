import apiClient from "./apiClinet";
import { handleApiResponse } from "@/lib/handleApiResponse";

export const fetchusers = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  console.log(page, limit);
  return handleApiResponse(() => apiClient.get(`/admin/dashboard`));
};
export const blockUser = ({ userid }: { userid: string }) => {
  return handleApiResponse(() => apiClient.get(`/block-user/${userid}`));
};
export const unblockUser = ({ userid }: { userid: string }) => {
  return handleApiResponse(() => apiClient.get(`/unblock-user/${userid}`));
};
