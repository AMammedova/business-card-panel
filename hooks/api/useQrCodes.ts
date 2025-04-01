import {
  deleteQrCode,
  downloadQrCode,
  fetchQrCodes,
  generateQrCode,
} from "@/services/qrCodeService";
import { QrCodeResponse } from "@/shared/types/qrcode-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

export const useQrCodes = ({
  pageNumber,
  pageSize,
}: {
  pageNumber: number;
  pageSize: number;
}) => {
  return useQuery<QrCodeResponse["data"]>({
    queryKey: ["qrcodes", pageNumber, pageSize],
    queryFn: () => fetchQrCodes({ pageNumber, pageSize }),
  });
};

export const useDeleteQrCode = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("qr_codes");

  return useMutation({
    mutationFn: deleteQrCode,
    onSuccess: () => {
      toast.success(t("delete_success"));
      queryClient.invalidateQueries({ queryKey: ["qrcodes"] });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || t("delete_error"));
    },
  });
};

export const useGenerateQrCode = () => {
  return useMutation({
    mutationKey: ["generateQrCode"],
    mutationFn: (employeeId: number) => generateQrCode(employeeId),
    onSuccess: () => {
      toast.success("QR Code generated successfully!");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      console.error(error, "Error generating QR Code:", error);
    },
  });
};
export const useDownloadQrCode = () => {
  const t = useTranslations("qr-codes");

  return useMutation({
    mutationKey: ["downloadQrCode"],
    mutationFn: (url: string) => downloadQrCode(url),
    onSuccess: () => {
      toast.success(t("download_success"));
    },
    onError: () => {
      toast.error(t("download_error"));
    },
  });
};
