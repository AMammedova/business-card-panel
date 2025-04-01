"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useCompanies, useDeleteCompany } from "@/hooks/api/useCompanies";
import PaginationComponent from "@/shared/components/Pagination/Pagination";
import NotFound from "@/shared/components/NotFound/NotFound";
import Spinner from "@/shared/components/Spinner/Spinner";
import { Button } from "@/shared/components/ui/button";
import CompanyTable from "./components/CompanyTable";
import AlertDialog from "@/shared/components/AlertDialog/AlertDiolog";
import AddCompanyModal from "./components/AddCompanyModal";
import EditCompanyModal from "./components/EditCompanyModal";
import { useTranslations } from "next-intl";

const CompanyPage: React.FC = () => {
  const t = useTranslations("companies");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  const [deleteCompanyId, setDeleteCompanyId] = useState<number | null>(null);
  const { data, isLoading, error } = useCompanies({ pageNumber, pageSize });
  const { mutate: deleteCompany, isPending: isDeleting } = useDeleteCompany();

  const handleAddCompany = () => {
    setIsAddModalOpen(true);
  };

  const handleEditCompany = (companyId: number) => {
    setSelectedCompany(companyId);
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    if (deleteCompanyId !== null) {
      deleteCompany(deleteCompanyId);
      setDeleteCompanyId(null);
      setPageNumber(1);
    }
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6 shadow-md p-6 rounded-md">
      <h2 className="text-2xl font-semibold text-black">{t("companies")}</h2>
      <Button
        onClick={handleAddCompany}
        className="bg-black hover:bg-black-2 text-sm px-4 py-2"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t("add_company")}
      </Button>
    </div>
  );

  const renderContent = () => {
    if (isLoading) return <Spinner />;
    if (!data?.items || error)
      return <NotFound message={t("no_companies")} />;

    return (
      <>
        <CompanyTable
          items={data.items}
          onEdit={handleEditCompany}
          onDelete={(id) => setDeleteCompanyId(id)}
        />
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
        open={deleteCompanyId !== null}
        title={t("confirm_delete_title")}
        description={t("confirm_delete_description")}
        confirmText={t("confirm")}
        cancelText={t("cancel")}
        isLoading={isDeleting}
        onClose={() => setDeleteCompanyId(null)}
        onConfirm={handleDelete}
      />
      <AddCompanyModal open={isAddModalOpen} setOpen={setIsAddModalOpen} />
      <EditCompanyModal
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        selectedCompanyId={selectedCompany}
      />
    </div>
  );
};

export default CompanyPage;
