// services/qrcodeService.ts
import apiClient from "@/lib/apiClient";
import { QrCodeResponse } from "@/shared/types/qrcode-types";
import { toast } from "react-toastify";


interface FetchQrCodesParams {
  pageNumber?: number;
  pageSize?: number;
}

export const fetchQrCodes = async ({
  pageNumber = 1,
  pageSize = 10,
}: FetchQrCodesParams): Promise<QrCodeResponse["data"]> => {
  const params = new URLSearchParams();
  params.append("pageNumber", pageNumber.toString());
  params.append("pageSize", pageSize.toString());

  const response = await apiClient.get(`/qrcodes/get?${params.toString()}`);
  return response.data.data;
};

export const deleteQrCode = async (id: number): Promise<void> => {
  await apiClient.delete(`/qrcodes/delete/${id}`);
};
export const generateQrCode = async (employeeId: number) => {
  try {
    const response = await apiClient.post(`/qrcodes/generate/${employeeId}`);
    return response.data;
  } catch (error: any) {
    toast.error(error.response?.data.message[0]);
    throw new Error(error.response?.data.message[0]);
  }
};
export const downloadQrCode = async (url: string): Promise<void> => {
  try {
    const response = await apiClient.get(`/qrcodes/download`, {
      params: { url },
      responseType: "blob", 
    });

    const blob = new Blob([response.data], { type: "image/png" });
    const downloadUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "qr_code.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(downloadUrl);
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Failed to download QR Code!");
    throw error;
  }
};
