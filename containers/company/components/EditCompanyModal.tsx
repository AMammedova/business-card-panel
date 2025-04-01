"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import * as z from "zod";
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/ui/tabs";
import Spinner from "@/shared/components/Spinner/Spinner";
import { parseISO, format } from "date-fns";
import { useUpdateCompany, useCompanyById } from "@/hooks/api/useCompanies";
import { getFirstInvalidLang } from "@/shared/utils/getFirstInvalidLang";
import { toast } from "react-toastify";

const EditCompanyModal = ({
  open,
  setOpen,
  selectedCompanyId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedCompanyId: number | null;
}) => {
  const t = useTranslations("companies");
  const tValidation = useTranslations("companies.validation");

  const [activeTab, setActiveTab] = useState("az");
  const { mutate: updateCompany, isPending: isUpdating } = useUpdateCompany();
  const {
    data: companyData,
    isLoading,
    refetch,
  } = useCompanyById(selectedCompanyId ?? undefined);

  const editCompanySchema = z.object({
    updateCompanyLocalizationDto: z.array(
      z.object({
        id: z.number(),
        name: z.string().min(1, tValidation("company_name_required")),
        slogan: z.string().optional(),
        email: z.string().email(tValidation("invalid_email")),
        location: z.string().min(1, tValidation("location_required")),
        phoneNumber: z.string().min(1, tValidation("phone_required")),
        language: z.enum(["az", "en", "ru"]),
      })
    ),
    isShow: z.boolean(),
    startDate: z.string().min(1, tValidation("start_date_required")),
  });

  type FormValues = z.infer<typeof editCompanySchema>;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(editCompanySchema),
  });

  useEffect(() => {
    if (companyData) {
      reset({
        updateCompanyLocalizationDto: companyData.companyLocalizationDtos,
        isShow: companyData.isShow,
        startDate: companyData.startDate
          ? format(parseISO(companyData.startDate), "yyyy-MM-dd")
          : "",
      });
    }
  }, [companyData, reset]);

  const onSubmit = (data: FormValues) => {
    updateCompany(
      { companyId: selectedCompanyId ?? 0, companyData: data },
      {
        onSuccess: () => {
          refetch();
          reset();
          setOpen(false);
        },
      }
    );
  };

  const onInvalid = (errors: any) => {
    const lang = getFirstInvalidLang(errors, "updateCompanyLocalizationDto");
    if (lang) {
      toast.error(tValidation("fill_lang_fields", { lang: lang.toUpperCase() }));
      setActiveTab(lang);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("edit_company_title")}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <Spinner />
        ) : (
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
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
                      {...register(`updateCompanyLocalizationDto.${index}.name`)}
                      placeholder={t("company_name")}
                    />
                    {errors.updateCompanyLocalizationDto?.[index]?.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.updateCompanyLocalizationDto[index].name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label>{t("slogan")}</label>
                    <Input
                      {...register(`updateCompanyLocalizationDto.${index}.slogan`)}
                      placeholder={t("slogan")}
                    />
                  </div>
                  <div>
                    <label>{t("email")}</label>
                    <Input
                      {...register(`updateCompanyLocalizationDto.${index}.email`)}
                      placeholder={t("email")}
                    />
                    {errors.updateCompanyLocalizationDto?.[index]?.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.updateCompanyLocalizationDto[index].email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label>{t("location")}</label>
                    <Input
                      {...register(`updateCompanyLocalizationDto.${index}.location`)}
                      placeholder={t("location")}
                    />
                  </div>
                  <div>
                    <label>{t("phone_number")}</label>
                    <Input
                      {...register(`updateCompanyLocalizationDto.${index}.phoneNumber`)}
                      placeholder={t("phone_number")}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div>
              <label>{t("start_date")}</label>
              <Input type="date" {...register("startDate")} />
              {errors.startDate && (
                <p className="text-red-500 text-xs">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label>{t("show_company")}</label>
              <Controller
                name="isShow"
                control={control}
                render={({ field }) => (
                  <Select
                    key={String(field.value)}
                    onValueChange={(value) => field.onChange(value === "true")}
                    defaultValue={String(field.value)}
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
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? <Spinner /> : t("update_button")}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditCompanyModal;
