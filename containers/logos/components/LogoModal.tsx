"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useAllCompanies } from "@/hooks/api/useCompanies";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useCreateLogo, useUpdateLogo } from "@/hooks/api/useLogos";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

interface LogoModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  refech: () => void;
  selectedLogo?: {
    id?: number;
    companyId?: number;
    isActive?: boolean;
    url?: string;
  } | null;
}

const LogoModal: React.FC<LogoModalProps> = ({
  open,
  setOpen,
  selectedLogo,
  refech,
}) => {
  const t = useTranslations("logos");
  const [file, setFile] = useState<File | null>(null);
  const [companyId, setCompanyId] = useState<number | undefined>(undefined);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: companies } = useAllCompanies();
  const { mutate: createLogo, isPending: isCreating } = useCreateLogo();
  const { mutate: updateLogo, isPending: isUpdating } = useUpdateLogo();

  useEffect(() => {
    if (selectedLogo) {
      setCompanyId(selectedLogo.companyId || undefined);
      setIsActive(selectedLogo.isActive ?? true);
      setPreviewUrl(selectedLogo.url ?? null);
    } else {
      setCompanyId(undefined);
      setIsActive(true);
      setPreviewUrl(null);
    }
    setFile(null);
  }, [selectedLogo]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(selectedLogo?.url ?? null);
    }
  };

  const handleSubmit = () => {
    if (!selectedLogo?.id && !file) {
      toast.error(t("error_file_required"));
      return;
    }

    if (!companyId) {
      toast.error(t("error_company_required"));
      return;
    }

    const formData = new FormData();
    formData.append("CompanyId", companyId.toString());
    formData.append("IsActive", isActive.toString());
    if (file) {
      formData.append("Logo", file);
    }

    const handleSuccess = () => {
      if (!selectedLogo?.id) {
        setFile(null);
        setCompanyId(undefined);
        setIsActive(true);
        setPreviewUrl(null);
      }

      setOpen(false);
      refech();
    };

    if (selectedLogo?.id) {
      updateLogo(
        { logoId: selectedLogo.id, formData },
        { onSuccess: handleSuccess }
      );
    } else {
      createLogo(formData, { onSuccess: handleSuccess });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedLogo?.id ? t("update_logo") : t("add_logo")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 mt-2">
          {/* Left: Preview */}
          <div className="md:w-1/3 w-full flex justify-center items-center">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Logo Preview"
                className="max-h-40 object-contain border rounded p-2"
              />
            ) : (
              <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded">
                <span className="text-gray-500 text-sm">{t("no_image")}</span>
              </div>
            )}
          </div>

          {/* Right: Form */}
          <div className="md:w-2/3 w-full space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("upload_logo")}
              </label>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("select_company")}
              </label>
              <Select
                onValueChange={(value) => setCompanyId(Number(value))}
                value={companyId ? companyId.toString() : ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("choose_company")} />
                </SelectTrigger>
                <SelectContent>
                  {companies?.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.companyLocalizationDtos?.[0]?.name ||
                        `Company ${company.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("status")}
              </label>
              <Select
                key={String(isActive)}
                onValueChange={(value) => setIsActive(value === "true")}
                value={String(isActive)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("select_status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">{t("active")}</SelectItem>
                  <SelectItem value="false">{t("inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isCreating || isUpdating}>
            {selectedLogo?.id ? t("update") : t("add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogoModal;
