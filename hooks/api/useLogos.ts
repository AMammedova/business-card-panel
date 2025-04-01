import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchLogos,
  deleteLogo,
  createLogo,
  updateLogo,
} from "@/services/logoService";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

interface LogoParams {
  companyId?: number;
  pageNumber?: number;
  pageSize?: number;
}

export const useLogos = ({
  companyId,
  pageNumber = 1,
  pageSize = 10,
}: LogoParams) => {
  return useQuery({
    queryKey: ["logos", companyId, pageNumber, pageSize],
    queryFn: () => fetchLogos({ companyId, pageNumber, pageSize }),
  });
};

export const useCreateLogo = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("logos");

  return useMutation({
    mutationFn: (formData: FormData) => createLogo(formData),
    onSuccess: (data) => {
      toast.success(data.message?.[0] || t("create_success"));
      queryClient.invalidateQueries({ queryKey: ["logos"] });
    },
    onError: () => toast.error(t("create_error")),
  });
};

export const useUpdateLogo = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("logos");

  return useMutation({
    mutationFn: ({
      logoId,
      formData,
    }: {
      logoId: number;
      formData: FormData;
    }) => updateLogo(logoId, formData),
    onSuccess: (data) => {
      toast.success(data.message?.[0] || t("update_success"));
      queryClient.invalidateQueries({ queryKey: ["logos"] });
    },
    onError: () => toast.error(t("update_error")),
  });
};

export const useDeleteLogo = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("logos");

  return useMutation({
    mutationFn: (logoId: number) => deleteLogo(logoId),
    onSuccess: (data) => {
      toast.success(data.message?.[0] || t("delete_success"));
      queryClient.invalidateQueries({ queryKey: ["logos"] });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || t("delete_error"));
    },
  });
};
