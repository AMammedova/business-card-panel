"use client";

import React, { useState } from "react";
import { Trash2, Download, XIcon, Copy } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { QrCode } from "@/shared/types/qrcode-types";
import { useTranslations } from "next-intl";
import { useDownloadQrCode } from "@/hooks/api/useQrCodes";
import { toast } from "react-toastify";

interface QrCodesTableProps {
  items: QrCode[];
  onDelete: (id: number) => void;
}

const QrCodesTable: React.FC<QrCodesTableProps> = ({ items, onDelete }) => {
  const t = useTranslations("qr_codes");
  const [selectedQr, setSelectedQr] = useState<string | null>(null);

  const { mutate: downloadQrCode, isPending: isDownloading } =
    useDownloadQrCode();

  const handleDownload = (qrUrl: string) => {
    if (!qrUrl) return;
    downloadQrCode(qrUrl);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t("copied")); // "Copied!" tərcüməsi faylında olmalıdır
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-md overflow-x-auto">
      <div className="grid grid-cols-6 bg-gray-100 px-6 py-3 font-semibold text-gray-700 text-sm">
        <div className="text-left">{t("v_qr_code")}</div>
        <div className="text-left">{t("qr_code_url")}</div>
        <div className="text-left">{t("baseUrl")}</div>
        <div className="text-left">{t("employee")}</div>
        <div className="text-left">{t("created_at")}</div>
        <div className="text-right">{t("actions")}</div>
      </div>

      {items.map((qrCode) => (
        <div
          key={qrCode.id}
          className="grid grid-cols-6 items-center border-t border-gray-200 px-6 py-4 hover:bg-gray-50 text-sm"
        >
          {/* V QR */}
          <div className="flex items-center">
            <img
              src={qrCode.vCodeUrl}
              alt="V-QR Code"
              width={50}
              height={50}
              className="cursor-pointer rounded shadow"
              onClick={() => setSelectedQr(qrCode.vCodeUrl)}
            />
          </div>

          {/* QR */}
          <div className="flex items-center">
            <img
              src={qrCode.qrCodeUrl}
              alt="QR Code"
              width={50}
              height={50}
              className="cursor-pointer rounded shadow"
              onClick={() => setSelectedQr(qrCode.qrCodeUrl)}
            />
          </div>

          {/* URL + Copy Icon */}
          <div className="flex items-center gap-2 text-blue-600 truncate">
            <span className="truncate">
              {qrCode.baseUrl.length > 20
                ? qrCode.baseUrl.slice(0, 20) + "..."
                : qrCode.baseUrl}
            </span>
            <Copy
              className="h-4 w-4 cursor-pointer hover:text-blue-800"
              onClick={() => handleCopy(qrCode.baseUrl)}
            />
          </div>

          {/* Employee */}
          <div className="text-gray-700">
            {qrCode.getEmployeeInfoForQrCodes.employeeName}
          </div>

          {/* Date */}
          <div className="text-gray-500">
            {new Date(qrCode.createdAt).toLocaleDateString()}
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <button
              onClick={() => onDelete(qrCode.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}

      {/* Modal Preview */}
      {selectedQr && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center relative">
            <XIcon
              onClick={() => setSelectedQr(null)}
              className="text-gray-800 absolute right-2 top-2 cursor-pointer"
            />
            <h2 className="text-lg font-semibold mb-2">{t("preview_title")}</h2>
            <img src={selectedQr} alt="QR Code" className="w-64 h-64 mx-auto" />
            <Button
              onClick={() => handleDownload(selectedQr!)}
              disabled={isDownloading}
              className="mt-4 w-full flex items-center justify-center gap-2"
            >
              <Download className="h-5" />
              {isDownloading ? t("downloading") : t("download")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrCodesTable;
