"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useQrCodes, useDeleteQrCode } from "@/hooks/api/useQrCodes";
import PaginationComponent from "@/shared/components/Pagination/Pagination";
import NotFound from "@/shared/components/NotFound/NotFound";
import Spinner from "@/shared/components/Spinner/Spinner";
import QrCodesTable from "./components/QrCodesTable";
import AlertDialog from "@/shared/components/AlertDialog/AlertDiolog";
import Modal from "./components/Modal";
import { Button } from "@/shared/components/ui/button";
import { useTranslations } from "next-intl";

const QrCodesPage: React.FC = () => {
  const t = useTranslations("qr_codes");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error, refetch } = useQrCodes({ pageNumber, pageSize });
  const { mutate: deleteQrCode, isPending: isDeleting } = useDeleteQrCode();

  const handleDelete = () => {
    if (deleteId !== null) {
      deleteQrCode(deleteId);
      setDeleteId(null);
      setPageNumber(1);
    }
  };

  const handleAddQrCode = () => {
    setIsModalOpen(true);
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6 shadow-md p-6 rounded-md">
      <h2 className="text-2xl font-semibold text-black">{t("qr_codes")}</h2>
      <Button
        onClick={handleAddQrCode}
        className="bg-black hover:bg-black-2 text-sm px-4 py-2"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t("add_qr_code")}
      </Button>
    </div>
  );

  const renderContent = () => {
    if (isLoading) return <Spinner />;
    if (!data?.items || error) return <NotFound message={t("no_qr_codes")} />;

    return (
      <>
        <QrCodesTable items={data.items} onDelete={(id) => setDeleteId(id)} />
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
      <Modal open={isModalOpen} setOpen={setIsModalOpen} refech={refetch} />
    </div>
  );
};

export default QrCodesPage;
