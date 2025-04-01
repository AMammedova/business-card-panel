// services/companyService.ts
import apiClient from "@/lib/apiClient";
import { Company, CreateCompanyPayload, UpdateCompanyPayload } from "@/shared/types/company-types";

interface CompanyParams {
  pageNumber?: number;
  pageSize?: number;
}

export const fetchCompanies = async ({
  pageNumber = 1,
  pageSize = 10,
}: CompanyParams) => {
  const params = new URLSearchParams();
  params.append("pageNumber", pageNumber.toString());
  params.append("pageSize", pageSize.toString());

  console.log("Fetching companies with params:", params.toString());

  const response = await apiClient.get(
    `/companies/get-all-pagination?${params.toString()}`
  );
  console.log("Fetched companies:", response.data);

  return response.data.data;
};
export const fetchAllCompanies = async (): Promise<Company[]> => {
  const response = await apiClient.get("/companies/get-all");
  return response.data.data;
};

export const deleteCompany = async (companyId: number) => {
  const response = await apiClient.delete(
    `/companies/delete?companyId=${companyId}`
  );
  return response.data;
};

export const createCompany = async (companyData: CreateCompanyPayload) => {
  const response = await apiClient.post("/companies/create", companyData);
  return response.data;
};

export const updateCompany = async (
  companyId: number,
  companyData: UpdateCompanyPayload
) => {
  const response = await apiClient.put(
    `/companies/update?companyId=${companyId}`,
    companyData
  );
  return response.data;
};

export const fetchCompanyById = async (companyId: number): Promise<Company> => {
  const response = await apiClient.get(
    `/companies/get-by-id?companyId=${companyId}`
  );
  return response.data.data;
};
