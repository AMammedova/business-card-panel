"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useCreateCompany } from "@/hooks/api/useCompanies";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/ui/tabs";
import Spinner from "@/shared/components/Spinner/Spinner";
import { FormValues, useCompanySchema } from "../hooks/validation";
import { getFirstInvalidLang } from "@/shared/utils/getFirstInvalidLang";
import { toast } from "react-toastify";

interface AddCompanyModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AddCompanyModal: React.FC<AddCompanyModalProps> = ({ open, setOpen }) => {
  const t = useTranslations("companies");
  const tValidation = useTranslations("companies.validation");
  const addCompanySchema = useCompanySchema();
  const [activeTab, setActiveTab] = useState("az");
  const { mutate: createCompany, isPending: isCreating } = useCreateCompany();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(addCompanySchema),
    defaultValues: {
      companyLocalizationDtos: ["az", "en", "ru"].map((lang) => ({
        name: "",
        slogan: "",
        email: "",
        location: "",
        phoneNumber: "",
        language: lang as "az" | "en" | "ru",
      })),
      isShow: true,
      startDate: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = (data: FormValues) => {
    createCompany(data, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };
  const onInvalid = (errors: any) => {
    const lang = getFirstInvalidLang(errors, "companyLocalizationDtos");
    if (lang) {
      toast.error(tValidation("fill_lang_fields", { lang: lang.toUpperCase() }));
      setActiveTab(lang);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("add_company_title")}</DialogTitle>
        </DialogHeader>
        <form   onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              {["az", "en", "ru"].map((lang) => (
                <TabsTrigger key={lang} value={lang}>
                  {lang.toUpperCase()}
                </TabsTrigger>
              ))}
            </TabsList>
            {["az", "en", "ru"].map((lang, index) => (
              <TabsContent key={lang} value={lang} className="space-y-4">
                <div>
                  <label>{t("company_name")}</label>
                  <Input
                    {...register(`companyLocalizationDtos.${index}.name`)}
                    placeholder={t("company_name")}
                  />
                  {errors.companyLocalizationDtos?.[index]?.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.companyLocalizationDtos[index].name.message!}
                    </p>
                  )}
                </div>
                <div>
                  <label>{t("slogan")}</label>
                  <Input
                    {...register(`companyLocalizationDtos.${index}.slogan`)}
                    placeholder={t("slogan")}
                  />
                </div>
                <div>
                  <label>{t("email")}</label>
                  <Input
                    {...register(`companyLocalizationDtos.${index}.email`)}
                    placeholder={t("email")}
                  />
                  {errors.companyLocalizationDtos?.[index]?.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.companyLocalizationDtos[index].email.message!}
                    </p>
                  )}
                </div>
                <div>
                  <label>{t("location")}</label>
                  <Input
                    {...register(`companyLocalizationDtos.${index}.location`)}
                    placeholder={t("location")}
                  />
                  {errors.companyLocalizationDtos?.[index]?.location && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.companyLocalizationDtos[index].location.message!}
                    </p>
                  )}
                </div>
                <div>
                  <label>{t("phone_number")}</label>
                  <Input
                    {...register(
                      `companyLocalizationDtos.${index}.phoneNumber`
                    )}
                    placeholder={t("phone_number")}
                  />
                  {errors.companyLocalizationDtos?.[index]?.phoneNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {
                        errors.companyLocalizationDtos[index].phoneNumber
                          .message!
                      }
                    </p>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
          <div>
            <label>{t("start_date")}</label>
            <Input type="date" {...register("startDate")} />
            {errors.startDate && (
              <p className="text-red-500 text-xs">
                {t(errors.startDate.message!)}
              </p>
            )}
          </div>
          <div>
            <label>{t("show_company")}</label>
            <Controller
              name="isShow"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => field.onChange(value === "true")}
                  value={String(field.value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("select_status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">{t("yes")}</SelectItem>
                    <SelectItem value="false">{t("no")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {t("cancel_button")}
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? <Spinner /> : t("add_button")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCompanyModal;
