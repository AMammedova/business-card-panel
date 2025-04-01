"use client";

import React from "react";
import { Trash2Icon, EditIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface Site {
  id: number;
  url: string;
  companyName: string;
}

interface SitesTableProps {
  sites: Site[];
  onEdit: (site: Site) => void;
  onDelete: (id: number) => void;
}

const SitesTable: React.FC<SitesTableProps> = ({ sites, onEdit, onDelete }) => {
  const t = useTranslations("sites");

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* Desktop Header */}
      <div className="hidden sm:grid grid-cols-4 border-b border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
        <div className="col-span-1 text-left text-sm font-medium dark:text-gray-200">
          {t("company")}
        </div>
        <div className="col-span-2 text-left text-sm font-medium dark:text-gray-200">
          {t("site_url")}
        </div>
        <div className="col-span-1 text-right text-sm font-medium dark:text-gray-200">
          {t("actions")}
        </div>
      </div>

      {sites?.map((site) => (
        <div
          key={site.id}
          className="grid grid-cols-1 sm:grid-cols-4 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:px-6 2xl:px-7.5 hover:bg-gray-50 dark:hover:bg-[#272B30]"
        >
          {/* Mobile View */}
          <div className="sm:hidden flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-black dark:text-white">{site.companyName}</p>
              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 underline break-all"
              >
                {site.url}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="text-gray-500 hover:text-primary"
                onClick={() => onEdit(site)}
                aria-label={t("edit_site")}
              >
                <EditIcon className="h-5 w-5" />
              </button>
              <button
                className="text-gray-500 hover:text-red-600"
                onClick={() => onDelete(site.id)}
                aria-label={t("delete_site")}
              >
                <Trash2Icon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden sm:flex col-span-1 items-center">
            <p className="text-sm text-black dark:text-white">{site.companyName}</p>
          </div>
          <div className="hidden sm:flex col-span-2 items-center">
            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 underline break-all"
            >
              {site.url}
            </a>
          </div>
          <div className="hidden sm:flex col-span-1 items-center justify-end gap-3">
            <button
              className="text-gray-500 hover:text-primary"
              onClick={() => onEdit(site)}
              aria-label={t("edit_site")}
            >
              <EditIcon className="h-5 w-5" />
            </button>
            <button
              className="text-gray-500 hover:text-red-600"
              onClick={() => onDelete(site.id)}
              aria-label={t("delete_site")}
            >
              <Trash2Icon className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SitesTable;
