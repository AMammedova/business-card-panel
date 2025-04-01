"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Company } from "@/shared/types/company-types";
import { useTranslations } from "next-intl";

interface CompanyDetailModalProps {
  open: boolean;
  onClose: () => void;
  company: Company | null;
}

const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({
  open,
  onClose,
  company,
}) => {
  const t = useTranslations("companies");

  if (!company) return null;

  const localization = company.companyLocalizationDtos[0];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {localization?.name} - {t("view")}
          </DialogTitle>
        </DialogHeader>

        {/* Company Details */}
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong>{t("company_name")}:</strong> {localization?.name}
          </p>
          <p>
            <strong>{t("slogan")}:</strong> {localization?.slogan || "-"}
          </p>
          <p>
            <strong>{t("email")}:</strong> {localization?.email}
          </p>
          <p>
            <strong>{t("phone_number")}:</strong> {localization?.phoneNumber}
          </p>
          <p>
            <strong>{t("location")}:</strong> {localization?.location}
          </p>
          <p>
            <strong>{t("start_date")}:</strong>{" "}
            {new Date(company.startDate).toLocaleDateString()}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("cancel_button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyDetailModal;
