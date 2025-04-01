// services/siteService.ts
import apiClient from "@/lib/apiClient";

interface SiteParams {
  companyId?: number;
  pageNumber?: number;
  pageSize?: number;
}

export const fetchSites = async ({ companyId, pageNumber = 1, pageSize =2 }: SiteParams) => {
  const params = new URLSearchParams();

  if (companyId) params.append("companyId", companyId.toString()); 
  params.append("pageNumber", pageNumber.toString());
  params.append("pageSize", pageSize.toString());

  console.log("Fetching sites with params:", params.toString());

  const response = await apiClient.get(`/sites/get?${params.toString()}`);
  console.log("Fetched sites:", response.data);

  return response.data.data;
};

interface SitePayload {
  id?: number;
  url: string;
  companyId: number;
}

export const saveSite = async ({ id, url, companyId }: SitePayload) => {
  return id
    ? (await apiClient.put(`/sites/update/${id}`, { url, companyId })).data
    : (await apiClient.post(`/sites/add`, { url, companyId })).data;
};

export const deleteSite = async (id: number) => {
  const response = await apiClient.delete(`/sites/delete/${id}`);
  return response.data;
};