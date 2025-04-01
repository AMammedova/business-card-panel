"use client";

import React, { useState } from "react";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Company } from "@/shared/types/company-types";
import CompanyDetailModal from "./CompanyDetailModal";
import { useTranslations } from "next-intl";

interface CompanyTableProps {
  items: Company[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const CompanyTable: React.FC<CompanyTableProps> = ({
  items,
  onEdit,
  onDelete,
}) => {
  const t = useTranslations("companies");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* Desktop Header */}
      <div className="hidden sm:grid grid-cols-5 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6">
      <div className="col-span-1 text-left text-sm font-medium">{t("name")}</div>
  <div className="col-span-1 text-left text-sm font-medium">{t("email")}</div>
  <div className="col-span-1 text-left text-sm font-medium">{t("phone")}</div>
  <div className="col-span-1 text-left text-sm font-medium">{t("location")}</div>
  <div className="col-span-1 text-right text-sm font-medium">{t("actions")}</div>
      </div>

      {/* Table Content */}
      {items.map((company) => (
        <div
          key={company.id}
          className="grid grid-cols-1 sm:grid-cols-5 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:px-6 hover:bg-gray-50 dark:hover:bg-[#272B30]"
        >
          {/* Mobile View */}
          <div className="sm:hidden flex flex-col gap-2 mb-2">
            <p className="text-sm font-medium text-black dark:text-white">
              {company.companyLocalizationDtos[0]?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              📧 {company.companyLocalizationDtos[0]?.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              📞 {company.companyLocalizationDtos[0]?.phoneNumber}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              📍 {company.companyLocalizationDtos[0]?.location}
            </p>
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedCompany(company)}
                className="text-gray-600 hover:text-primary"
              >
                <Eye className="h-5 w-5" />
              </button>
              <button
                onClick={() => onEdit(company.id)}
                className="text-gray-600 hover:text-blue-600"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(company.id)}
                className="text-gray-600 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Desktop Content */}
          <div className="hidden sm:flex col-span-1 items-center">
            <p className="text-sm text-black dark:text-white line-clamp-1">
              {company.companyLocalizationDtos[0]?.name}
            </p>
          </div>

          <div className="hidden sm:flex col-span-1 items-center">
            <p className="text-sm text-black dark:text-white line-clamp-1">
              {company.companyLocalizationDtos[0]?.email}
            </p>
          </div>

          <div className="hidden sm:flex col-span-1 items-center">
            <p className="text-sm text-black dark:text-white line-clamp-1">
              {company.companyLocalizationDtos[0]?.phoneNumber}
            </p>
          </div>

          <div className="hidden sm:flex col-span-1 items-center">
            <p className="text-sm text-black dark:text-white">
              {company.companyLocalizationDtos[0]?.location}
            </p>
          </div>

          {/* Actions */}
          <div className="hidden sm:flex col-span-1 justify-end gap-3">
            <button
              onClick={() => setSelectedCompany(company)}
              className="text-gray-500 hover:text-primary"
            >
              <Eye className="h-5 w-5" />
            </button>
            <button
              onClick={() => onEdit(company.id)}
              className="text-gray-500 hover:text-primary"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(company.id)}
              className="text-gray-500 hover:text-red-700"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}

      {/* Company Detail Modal */}
      <CompanyDetailModal
        open={!!selectedCompany}
        onClose={() => setSelectedCompany(null)}
        company={selectedCompany}
      />
    </div>
  );
};

export default CompanyTable;
