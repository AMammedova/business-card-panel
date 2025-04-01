"use client";

import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Employee } from "@/shared/types/employee";
import { useTranslations } from "next-intl";

interface EmployeeTableProps {
  items: Employee[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  items,
  onEdit,
  onDelete,
}) => {
  const t = useTranslations("employees");

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default">
      {/* Table Header */}
      <div className="grid grid-cols-12 border-b border-stroke px-4 py-3 font-medium text-sm text-left">
        <div className="col-span-1">{t("photo")}</div>
        <div className="col-span-2">{t("name")}</div>
        <div className="col-span-2">{t("email")}</div>
        <div className="col-span-2">{t("position")}</div>
        <div className="col-span-2">{t("phone")}</div>
        <div className="col-span-2 text-right">{t("actions")}</div>
      </div>

      {/* Table Content */}
      {items.map((employee) => (
        <div
          key={employee.id}
          className="grid grid-cols-12 border-b border-stroke px-4 py-4.5 hover:bg-gray-50 text-sm"
        >
          <div className="col-span-1 flex items-center">
            <img
              src={employee.pictureUrl}
              alt="Employee"
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium break-words">
              {employee.employeeLocalizations[0]?.name}{" "}
              {employee.employeeLocalizations[0]?.surname}
            </p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="text-gray-600 break-all">
              {employee.employeeLocalizations[0]?.mail}
            </p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="text-gray-600 break-words whitespace-pre-line">
              {employee.employeeLocalizations[0]?.position}
            </p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="text-gray-600">{employee.phoneNumber}</p>
          </div>
          <div className="col-span-2 flex justify-end items-center gap-3">
            <button
              className="text-gray-500 hover:text-primary"
              onClick={() => onEdit(employee.id)}
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              className="text-gray-500 hover:text-red-700"
              onClick={() => onDelete(employee.id)}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeTable;
