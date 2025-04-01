// services/logoService.ts
import apiClient from "@/lib/apiClient";

interface LogoParams {
  companyId?: number;
  pageNumber?: number;
  pageSize?: number;
}

export const fetchLogos = async ({
  companyId,
  pageNumber = 1,
  pageSize = 10,
}: LogoParams) => {
  const params = new URLSearchParams();
  if (companyId) params.append("companyId", companyId.toString());
  params.append("pageNumber", pageNumber.toString());
  params.append("pageSize", pageSize.toString());

  const response = await apiClient.get(`/logos/get?${params.toString()}`);
  return response.data.data;
};
export const createLogo = async (formData: FormData) => {
  const response = await apiClient.post("/logos/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateLogo = async (logoId: number, formData: FormData) => {
  const response = await apiClient.put(
    `/logos/update?logoId=${logoId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

export const deleteLogo = async (logoId: number) => {
  const response = await apiClient.delete(`/logos/delete?logoId=${logoId}`);
  return response.data;
};
