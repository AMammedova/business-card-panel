"use client";

import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import PaginationComponent from "@/shared/components/Pagination/Pagination";
import NotFound from "@/shared/components/NotFound/NotFound";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useAllCompanies } from "@/hooks/api/useCompanies";
import { useDeleteSite, useSites } from "@/hooks/api/useSites";
import SitesTable from "./componnets/SitesTable";
import SitesModal from "./componnets/SitesModal";
import { Company } from "@/shared/types/company-types";
import Spinner from "@/shared/components/Spinner/Spinner";
import AlertDialog from "@/shared/components/AlertDialog/AlertDiolog";

const SitesContainer: React.FC = () => {
  const t = useTranslations("sites");

  const [companyId, setCompanyId] = useState<number | undefined>(undefined);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(5);
  const [selectedSite, setSelectedSite] = useState<{
    id: number;
    url: string;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteSiteId, setDeleteSiteId] = useState<number | null>(null);

  const { data: companies } = useAllCompanies();
  const { data, isLoading, error } = useSites({
    companyId,
    pageNumber,
    pageSize,
  });
  const { mutate: deleteSite, isPending: isDeleting } = useDeleteSite();

  const handleEdit = (site: { id: number; url: string }) => {
    setSelectedSite(site);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (deleteSiteId !== null) {
      deleteSite(deleteSiteId);
      setDeleteSiteId(null);
    }
  };

  const handleSelectCompany = (value: string) => {
    setCompanyId(value === "0" ? undefined : Number(value));
  };

  return (
    <div className="p-6 bg-white rounded-md">
      <div className="flex justify-between items-center mb-6 shadow-md p-6 rounded-md">
        <h2 className="text-2xl font-semibold text-black">{t("sites")}</h2>
        <div className="flex gap-4 items-center">
          <Select onValueChange={handleSelectCompany}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t("select_company")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("companies")}</SelectLabel>
                <SelectItem value="0">{t("all_companies")}</SelectItem>
                {companies?.map((company: Company) => (
                  <SelectItem key={company.id} value={company.id.toString()}>
                    {company.companyLocalizationDtos?.[0]?.name ||
                      `Company ${company.id}`}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            onClick={() => {
              setSelectedSite(null);
              setIsModalOpen(true);
            }}
            className="bg-black hover:bg-black-2 dark:bg-white text-sm px-4 py-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("add_site")}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-24">
          <Spinner />
        </div>
      ) : !data?.items || error ? (
        <NotFound message={t("no_sites")} />
      ) : (
        <>
          <SitesTable
            sites={data.items}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteSiteId(id)}
          />
          <PaginationComponent
            currentPage={pageNumber}
            totalPages={data.totalPages || 1}
            onPageChange={setPageNumber}
          />
        </>
      )}

      <SitesModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        selectedSite={selectedSite}
        companies={companies || []}
      />

      <AlertDialog
        open={deleteSiteId !== null}
        title={t("confirm_delete_title")}
        description={t("confirm_delete_description")}
        confirmText={t("confirm")}
        cancelText={t("cancel")}
        isLoading={isDeleting}
        onClose={() => setDeleteSiteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default SitesContainer;
