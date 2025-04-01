"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import PaginationComponent from "@/shared/components/Pagination/Pagination";
import NotFound from "@/shared/components/NotFound/NotFound";
import Spinner from "@/shared/components/Spinner/Spinner";
import { Button } from "@/shared/components/ui/button";
import EmployeeTable from "./components/EmployeeTable";
import {
  useDeleteEmployee,
  usePaginationEmployees,
} from "@/hooks/api/useEmployees";
import AddEmployeeModal from "./components/AddEmployeeModal";
import EditEmployeeModal from "./components/EditEmployeeModal";
import AlertDialog from "@/shared/components/AlertDialog/AlertDiolog";
import { useTranslations } from "next-intl";

const EmployeePage: React.FC = () => {
  const t = useTranslations("employees");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [deleteCompanyId, setDeleteCompanyId] = useState<number | null>(null);
  const { mutate: deleteEmployee, isPending: isDeleting } = useDeleteEmployee();
  const { data, isLoading, error, refetch } = usePaginationEmployees({
    pageNumber,
    pageSize,
  });
  const handleAddEmployee = () => {
    setIsAddModalOpen(true);
  };

  const handleEditEmployee = (employeeId: number) => {
    setSelectedEmployee(employeeId);
    setIsEditModalOpen(true);
  };
  const handleDelete = () => {
    if (deleteCompanyId !== null) {
      deleteEmployee(deleteCompanyId);
      setDeleteCompanyId(null);
      setPageNumber(1);
      refetch();
    }
  };
  const renderHeader = () => (
    <div className="flex justify-between items-center mb-6 shadow-md p-6 rounded-md">
      <h2 className="text-2xl font-semibold text-black">{t("employees")}</h2>
      <Button
        onClick={handleAddEmployee}
        className="bg-black hover:bg-black-2 text-sm px-4 py-2"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t("add_employee")}
      </Button>
    </div>
  );

  const renderContent = () => {
    if (isLoading) return <Spinner />;
    if (!data?.items || error) return <NotFound message={t("no_employees")} />;

    return (
      <>
        <EmployeeTable
          items={data.items}
          onEdit={handleEditEmployee}
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

      <AddEmployeeModal open={isAddModalOpen} setOpen={setIsAddModalOpen} />
      <EditEmployeeModal
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        selectedEmployeeId={selectedEmployee}
      />
    </div>
  );
};

export default EmployeePage;
