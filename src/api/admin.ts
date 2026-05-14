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
const analyticsEndpoints = {
  overview: "/analytics/overview",
  topEndpoints: "/analytics/top-endpoints",
  topEndpointsMethod: "/analytics/top-endpoints-method",
  traffic: "/analytics/traffic",
  avgResponse: "/analytics/avg-response",
  errors: "/analytics/errors",
  slowEndpoints: "/analytics/slow-endpoints",
};

export const fetchAnalytics = (key: keyof typeof analyticsEndpoints) => {
  return handleApiResponse(() => apiClient.get(analyticsEndpoints[key]));
};
export const assignrole = async (data: { userId: string; role: string }) => {
  const { userId, role } = data;
  return handleApiResponse(() =>
    apiClient.post(`/assign-role/${userId}`, { role }),
  );
};
