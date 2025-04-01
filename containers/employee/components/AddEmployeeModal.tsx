"use client";

import React, { useState } from "react";
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
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/ui/tabs";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateEmployee } from "@/hooks/api/useEmployees";
import { useAllCompanies } from "@/hooks/api/useCompanies";
import Spinner from "@/shared/components/Spinner/Spinner";
import { Company } from "@/shared/types/company-types";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { useEmployeeSchema } from "../hooks/validation";
import { getFirstInvalidLang } from "@/shared/utils/getFirstInvalidLang";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AddEmployeeModal: React.FC<Props> = ({ open, setOpen }) => {
  const employeeSchema = useEmployeeSchema();
  type FormValues = z.infer<typeof employeeSchema>;
  const t = useTranslations("employees");
  const tValidation = useTranslations("employees.validation");
  const [activeLang, setActiveLang] = useState("az");
  const { data: companies } = useAllCompanies();
  const { mutate: createEmployee, isPending } = useCreateEmployee();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      isActive: true,
      phoneNumber: "",
      employeeLocalizationDtos: ["az", "en", "ru"].map((lang) => ({
        name: "",
        surname: "",
        mail: "",
        position: "",
        language: lang as "az" | "en" | "ru",
      })),
      companyIds: [],
    },
  });

  const onSubmit = (data: FormValues) => {
    const payload = {
      ...data,
      picture: data.picture?.[0],
    };

    createEmployee(payload, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };
  const onInvalid = (errors: any) => {
    const lang = getFirstInvalidLang(errors, "employeeLocalizationDtos");
    if (lang) {
      toast.error(
        tValidation("fill_lang_fields", { lang: lang.toUpperCase() })
      );

      setActiveLang(lang);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("add_employee")}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="space-y-4"
        >
          <Tabs value={activeLang} onValueChange={setActiveLang}>
            <TabsList>
              {["az", "en", "ru"].map((lang) => (
                <TabsTrigger key={lang} value={lang}>
                  {lang.toUpperCase()}
                </TabsTrigger>
              ))}
            </TabsList>

            {["az", "en", "ru"].map((lang, index) => (
              <TabsContent key={lang} value={lang} className="space-y-4">
                <div>
                  <Input
                    {...register(`employeeLocalizationDtos.${index}.name`)}
                    placeholder={t("name")}
                  />
                  {errors.employeeLocalizationDtos?.[index]?.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.employeeLocalizationDtos[index]?.name?.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    {...register(`employeeLocalizationDtos.${index}.surname`)}
                    placeholder={t("surname")}
                  />
                  {errors.employeeLocalizationDtos?.[index]?.surname && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.employeeLocalizationDtos[index]?.surname?.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    {...register(`employeeLocalizationDtos.${index}.mail`)}
                    placeholder={t("email")}
                  />
                  {errors.employeeLocalizationDtos?.[index]?.mail && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.employeeLocalizationDtos[index]?.mail?.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    {...register(`employeeLocalizationDtos.${index}.position`)}
                    placeholder={t("position")}
                  />
                  {errors.employeeLocalizationDtos?.[index]?.position && (
                    <p className="text-red-500 text-xs mt-1">
                      {
                        errors.employeeLocalizationDtos[index]?.position
                          ?.message
                      }
                    </p>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
          <div>
            <label>{t("phone_number")}</label>
            <Input
              {...register("phoneNumber")}
              placeholder={t("phone_number")}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <div>
            <label>{t("active_status")}</label>
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <Select
                  onValueChange={(val) => field.onChange(val === "true")}
                  value={String(field.value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("select_status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">{t("active")}</SelectItem>
                    <SelectItem value="false">{t("inactive")}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <label>{t("select_company")}</label>
            <Controller
              control={control}
              name="companyIds"
              render={({ field }) => (
                <Select
                  onValueChange={(val) => field.onChange([parseInt(val)])}
                  value={field.value[0]?.toString() ?? ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("select_company")} />
                  </SelectTrigger>
                  <SelectContent>
                    {companies?.map((company: Company) => (
                      <SelectItem
                        key={company.id}
                        value={company.id.toString()}
                      >
                        {company?.companyLocalizationDtos[0]?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.companyIds && (
              <p className="text-red-500 text-xs mt-1">
                {errors.companyIds.message}
              </p>
            )}
          </div>

          <div>
            <label>{t("upload_picture")}</label>
            <Input type="file" {...register("picture")} />
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : t("add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeModal;
