"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useLogos, useDeleteLogo } from "@/hooks/api/useLogos";
import PaginationComponent from "@/shared/components/Pagination/Pagination";
import NotFound from "@/shared/components/NotFound/NotFound";
import Spinner from "@/shared/components/Spinner/Spinner";
import AlertDialog from "@/shared/components/AlertDialog/AlertDiolog";
import LogoCard from "./components/LogoCard";
import { Button } from "@/shared/components/ui/button";
import { Logo } from "@/shared/types/logo-types";
import LogoModal from "./components/LogoModal";
import { useAllCompanies } from "@/hooks/api/useCompanies";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Company } from "@/shared/types/company-types";
import { useTranslations } from "next-intl";

const LogoPage: React.FC = () => {
  const t = useTranslations("logos");

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [companyId, setCompanyId] = useState<number | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState<Logo | null>(null);

  const { data, isLoading, error, refetch } = useLogos({
    pageNumber,
    pageSize,
    companyId,
  });

  const { mutate: deleteLogo, isPending: isDeleting } = useDeleteLogo();
  const { data: companies } = useAllCompanies();

  const handleDelete = () => {
    if (deleteId !== null) {
      deleteLogo(deleteId);
      setDeleteId(null);
      setPageNumber(1);
    }
  };

  const handleEdit = (logo: Logo) => {
    setSelectedLogo(logo);
    setIsModalOpen(true);
  };

  const handleAddLogo = () => {
    setSelectedLogo(null);
    setIsModalOpen(true);
  };

  const handleSelectCompany = (value: string) => {
    setCompanyId(value === "0" ? undefined : Number(value));
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6 shadow-md p-6 rounded-md">
      <h2 className="text-2xl font-semibold text-black">{t("logos")}</h2>

      <div className="flex gap-4 items-center">
        <Select onValueChange={handleSelectCompany}>
          <SelectTrigger className="w-full">
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
          onClick={handleAddLogo}
          className="bg-black hover:bg-black-2 text-sm px-4 py-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("add_logo")}
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) return <Spinner />;
    if (!data?.items || error) return <NotFound message={t("no_logos")} />;

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {data.items.map((logo: Logo) => (
            <LogoCard
              key={logo.id}
              logo={logo}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>

        <PaginationComponent
          currentPage={pageNumber}
          totalPages={data.totalPages}
          onPageChange={setPageNumber}
        />
      </>
    );
  };

  return (
    <div className="p-6 bg-white rounded-md">
      {renderHeader()}
      {renderContent()}

      <AlertDialog
        open={deleteId !== null}
        title={t("delete_title")}
        description={t("delete_description")}
        confirmText={t("delete")}
        cancelText={t("cancel")}
        isLoading={isDeleting}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />

      <LogoModal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        selectedLogo={selectedLogo}
        refech={refetch}
      />
    </div>
  );
};

export default LogoPage;
