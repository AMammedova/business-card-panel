"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useEmployees } from "@/hooks/api/useEmployees";
import { useGenerateQrCode } from "@/hooks/api/useQrCodes";
import { Employee } from "@/shared/types/employee";
import { useTranslations } from "next-intl";

interface GenerateQrCodeModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  refech: () => void;
}

const Modal: React.FC<GenerateQrCodeModalProps> = ({
  open,
  setOpen,
  refech,
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const { data: employees } = useEmployees();
  const { mutate: generateQrCode, isPending } = useGenerateQrCode();
const t=useTranslations("qr_codes")
  const handleGenerateQrCode = () => {
    if (selectedEmployee) {
      generateQrCode(selectedEmployee, {
        onSuccess: () => {
          setSelectedEmployee(null);
          setOpen(false);
          refech();
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md p-6 text-center">
        <DialogHeader>
          <DialogTitle>{t("add_qr_code")}</DialogTitle>
        </DialogHeader>
        <Select onValueChange={(value) => setSelectedEmployee(Number(value))}>
          <SelectTrigger>
            <SelectValue placeholder={t("select_employee")} />
          </SelectTrigger>
          <SelectContent>
            {employees?.map((employee: Employee) => (
              <SelectItem key={employee.id} value={employee.id.toString()}>
                {employee.employeeLocalizations[0]?.name}{" "}
                {employee.employeeLocalizations[0]?.surname}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleGenerateQrCode}
          disabled={isPending}
          className="mt-4"
        >
          {isPending ? t("generating") : t("generate_qr_code")}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
