"use client";

import React from "react";
import { Edit, Trash } from "lucide-react";
import { Logo } from "@/shared/types/logo-types";
import { useTranslations } from "next-intl";

interface LogoCardProps {
  logo: Logo;
  onEdit: (logo: Logo) => void;
  onDelete: (id: number) => void;
}

const LogoCard: React.FC<LogoCardProps> = ({ logo, onEdit, onDelete }) => {
  const t= useTranslations("logos");

  return (
    <div className="flex justify-center items-center mt-8 transition-transform duration-300 hover:scale-105">
      <div className="w-full mx-auto ">
        {/* Horizontal card container */}
        <div className="flex gap-4 h-60 overflow-hidden border border-gray-200 rounded-xl shadow-md bg-white">
          {/* Left side: Logo image */}
          <div className="w-1/2">
            <img
              src={logo.url}
              alt={logo.companyName}
              className="w-full h-full object-contain p-2"
            />
          </div>

          {/* Right side: Title & actions */}
          <div className="w-1/2 p-4 flex flex-col justify-around text-gray-700">
            {/* Company Name */}
            <h5 className="text-lg font-semibold text-blue-gray-900">
              {logo.companyName}
            </h5>

            {/* Action buttons */}
            <div className="flex items-start  flex-col gap-4">
              <button
                onClick={() => onEdit(logo)}
                className="flex items-center gap-1 text-xs font-bold uppercase py-2 px-3 rounded-lg bg-white border  shadow-md text-gray-800   focus:outline-none focus:ring-2 focus:ring-gray-800"
              >
                <Edit size={16} />
                {t("edit")}
              </button>
              <button
                onClick={() => onDelete(logo.id)}
                className="flex items-center gap-1 text-xs font-bold uppercase py-2 px-3 rounded-lg bg-red-600 text-white shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <Trash size={16} />
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoCard;
