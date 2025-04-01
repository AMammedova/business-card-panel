// hooks/useSites.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteSite, fetchSites, saveSite } from "@/services/siteService";
import { toast } from "react-toastify";

interface SiteParams {
  companyId?: number;
  pageNumber?: number;
  pageSize?: number;
}

export const useSites = ({
  companyId,
  pageNumber = 1,
  pageSize = 10,
}: SiteParams) => {
  return useQuery({
    queryKey: ["sites", companyId, pageNumber, pageSize],
    queryFn: () => fetchSites({ companyId, pageNumber, pageSize }),
  });
};

export const useSaveSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveSite,
    onSuccess: (data) => {
      toast.success(data.message?.[0] || "Operation successful!");
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "An error occurred!");
    },
  });
};

export const useDeleteSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSite,
    onSuccess: (data) => {
      toast.success(data.message?.[0] || "Site deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["sites"] });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "An error occurred!");
    },
  });
};
