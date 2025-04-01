import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCompany,
  deleteCompany,
  fetchAllCompanies,
  fetchCompanies,
  fetchCompanyById,
  updateCompany,
} from "@/services/companyService";
import { toast } from "react-toastify";
import { CreateCompanyPayload, UpdateCompanyPayload } from "@/shared/types/company-types";
import { useTranslations } from "next-intl";

interface CompanyParams {
  pageNumber?: number;
  pageSize?: number;
}

export const useCompanies = ({
  pageNumber = 1,
  pageSize = 10,
}: CompanyParams = {}) => {
  return useQuery({
    queryKey: ["companies", pageNumber, pageSize],
    queryFn: () => fetchCompanies({ pageNumber, pageSize }),
  });
};

export const useAllCompanies = () => {
  return useQuery({
    queryKey: ["companies", "all"],
    queryFn: fetchAllCompanies,
  });
};

export const useDeleteCompany = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("companies");

  return useMutation({
    mutationFn: deleteCompany,
    onSuccess: (data) => {
      toast.success(data.message?.[0] || t("delete_success"));
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || t("delete_error"));
    },
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("companies");

  return useMutation({
    mutationFn: (companyData: CreateCompanyPayload) =>
      createCompany(companyData),
    onSuccess: () => {
      toast.success(t("create_success"));
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: () => toast.error(t("create_error")),
  });
};

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("companies");

  return useMutation({
    mutationFn: ({
      companyId,
      companyData,
    }: {
      companyId: number;
      companyData: UpdateCompanyPayload;
    }) => updateCompany(companyId, companyData),
    onSuccess: () => {
      toast.success(t("update_success"));
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: () => toast.error(t("update_error")),
  });
};

export const useCompanyById = (companyId?: number) => {
  return useQuery({
    queryKey: ["company", companyId],
    queryFn: () => (companyId ? fetchCompanyById(companyId) : null),
    enabled: !!companyId,
  });
};
