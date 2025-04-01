"use client";

import React from "react";
import {
  AlertDialog as ShadAlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

interface AlertDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  onClose,
  onConfirm,
}) => {
  return (
    <ShadAlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-700">{title}</AlertDialogTitle>
          {description && <p className="text-gray-500">{description}</p>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-700 hover:bg-red-500"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </ShadAlertDialog>
  );
};

export default AlertDialog;
