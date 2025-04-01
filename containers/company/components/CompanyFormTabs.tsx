"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { Input } from "@/shared/components/ui/input";

interface CompanyFormTabsProps {
  register: any;
  errors: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isEditMode: boolean;
}

const CompanyFormTabs: React.FC<CompanyFormTabsProps> = ({
  register,
  errors,
  activeTab,
  setActiveTab,
  isEditMode,
}) => {
  const languages = ["az", "en", "ru"];
  const getFieldPath = (index: number, field: string) =>
    isEditMode
      ? `updateCompanyLocalizationDto.${index}.${field}`
      : `companyLocalizationDtos.${index}.${field}`;

  const getFieldError = (index: number, field: string) =>
    errors?.[getFieldPath(index, field)]?.message;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="flex justify-center bg-gray-200 p-1 rounded-md">
        {languages.map((lang) => (
          <TabsTrigger key={lang} value={lang}>
            {lang.toUpperCase()}
          </TabsTrigger>
        ))}
      </TabsList>

      {languages.map((lang, index) => (
        <TabsContent key={lang} value={lang} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Company Name *</label>
            <Input {...register(getFieldPath(index, "name"))} placeholder="Company Name" />
            {getFieldError(index, "name") && (
              <p className="text-red-500 text-xs">{getFieldError(index, "name")}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Slogan</label>
            <Input {...register(getFieldPath(index, "slogan"))} placeholder="Slogan" />
          </div>

          <div>
            <label className="text-sm font-medium">Company Info</label>
            <Input {...register(getFieldPath(index, "info"))} placeholder="Company Info" />
          </div>

          <div>
            <label className="text-sm font-medium">Email *</label>
            <Input {...register(getFieldPath(index, "email"))} placeholder="Email" />
            {getFieldError(index, "email") && (
              <p className="text-red-500 text-xs">{getFieldError(index, "email")}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Location *</label>
            <Input {...register(getFieldPath(index, "location"))} placeholder="Location" />
            {getFieldError(index, "location") && (
              <p className="text-red-500 text-xs">{getFieldError(index, "location")}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Phone Number *</label>
            <Input {...register(getFieldPath(index, "phoneNumber"))} placeholder="Phone Number" />
            {getFieldError(index, "phoneNumber") && (
              <p className="text-red-500 text-xs">{getFieldError(index, "phoneNumber")}</p>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default CompanyFormTabs;
