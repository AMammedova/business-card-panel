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
import Spinner from "@/shared/components/Spinner/Spinner";
import { useUpdateEmployee, useEmployeeById } from "@/hooks/api/useEmployees";
import { getFirstInvalidLang } from "@/shared/utils/getFirstInvalidLang";
import { toast } from "react-toastify";

const EditEmployeeModal = ({
  open,
  setOpen,
  selectedEmployeeId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedEmployeeId: number | null;
}) => {
  const t = useTranslations("employees");
  const tValidation = useTranslations("employees.validation");

  const [activeTab, setActiveTab] = useState("az");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    data: employeeData,
    isLoading,
    refetch,
  } = useEmployeeById(selectedEmployeeId ?? undefined);
  const { mutate: updateEmployee, isPending } = useUpdateEmployee();

  const editEmployeeSchema = z.object({
    isActive: z.boolean(),
    phoneNumber: z.string().min(1, tValidation("phone_required")),
    updateEmployeeLocalizationDtos: z.array(
      z.object({
        id: z.number(),
        name: z.string().min(1, tValidation("name_required")),
        surname: z.string().min(1, tValidation("surname_required")),
        mail: z.string().email(tValidation("email_invalid")),
        position: z.string().min(1, tValidation("position_required")),
        language: z.enum(["az", "en", "ru"]),
      })
    ),
    picture: z.any().optional(),
  });

  type FormValues = z.infer<typeof editEmployeeSchema>;

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(editEmployeeSchema),
  });

  const pictureWatch = watch("picture");

  useEffect(() => {
    if (employeeData) {
      reset({
        isActive: employeeData.isActive,
        phoneNumber: employeeData.phoneNumber ?? "",
        updateEmployeeLocalizationDtos: employeeData.employeeLocalizations.map(
          (loc) => ({
            id: loc.id,
            name: loc.name,
            surname: loc.surname,
            mail: loc.mail,
            position: loc.position,
            language: loc.language as "az" | "en" | "ru",
          })
        ),
        picture: undefined,
      });

      if (employeeData.pictureUrl) {
        setPreviewUrl(employeeData.pictureUrl);
      }
    }
  }, [employeeData, reset]);

  useEffect(() => {
    const file = pictureWatch?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  }, [pictureWatch]);

  const onSubmit = (formData: FormValues) => {
    const formPayload = new FormData();
    formPayload.append("id", String(selectedEmployeeId));
    formPayload.append("isActive", String(formData.isActive));
    formPayload.append("phoneNumber", formData.phoneNumber);

    formData.updateEmployeeLocalizationDtos.forEach((loc, i) => {
      formPayload.append(
        `updateEmployeeLocalizationDtos[${i}][id]`,
        loc.id.toString()
      );
      formPayload.append(
        `updateEmployeeLocalizationDtos[${i}][name]`,
        loc.name
      );
      formPayload.append(
        `updateEmployeeLocalizationDtos[${i}][surname]`,
        loc.surname
      );
      formPayload.append(
        `updateEmployeeLocalizationDtos[${i}][mail]`,
        loc.mail
      );
      formPayload.append(
        `updateEmployeeLocalizationDtos[${i}][position]`,
        loc.position
      );
      formPayload.append(
        `updateEmployeeLocalizationDtos[${i}][language]`,
        loc.language
      );
    });

    if (formData.picture?.[0]) {
      formPayload.append("picture", formData.picture[0]);
    }

    updateEmployee(
      { employeeId: selectedEmployeeId ?? 0, employeeData: formPayload },
      {
        onSuccess: () => {
          reset();
          setPreviewUrl(null);
          setOpen(false);
          refetch();
        },
      }
    );
  };

  const onInvalid = (errors: any) => {
    const lang = getFirstInvalidLang(errors, "updateEmployeeLocalizationDtos");
    if (lang) {
      toast.error(
        tValidation("fill_lang_fields", { lang: lang.toUpperCase() })
      );
      setActiveTab(lang);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("edit_employee")}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <Spinner />
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="space-y-6"
          >
            {previewUrl && (
              <div className="w-full flex justify-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-40 object-contain rounded border p-2"
                />
              </div>
            )}
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
                    <Input
                      {...register(
                        `updateEmployeeLocalizationDtos.${index}.name`
                      )}
                      placeholder={t("name")}
                    />
                    {errors.updateEmployeeLocalizationDtos?.[index]?.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {
                          errors.updateEmployeeLocalizationDtos[index].name
                            ?.message
                        }
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      {...register(
                        `updateEmployeeLocalizationDtos.${index}.surname`
                      )}
                      placeholder={t("surname")}
                    />
                    {errors.updateEmployeeLocalizationDtos?.[index]
                      ?.surname && (
                      <p className="text-red-500 text-xs mt-1">
                        {
                          errors.updateEmployeeLocalizationDtos[index].surname
                            ?.message
                        }
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      {...register(
                        `updateEmployeeLocalizationDtos.${index}.mail`
                      )}
                      placeholder={t("email")}
                    />
                    {errors.updateEmployeeLocalizationDtos?.[index]?.mail && (
                      <p className="text-red-500 text-xs mt-1">
                        {
                          errors.updateEmployeeLocalizationDtos[index].mail
                            ?.message
                        }
                      </p>
                    )}
                  </div>
                  <div>
                    <Input
                      {...register(
                        `updateEmployeeLocalizationDtos.${index}.position`
                      )}
                      placeholder={t("position")}
                    />
                    {errors.updateEmployeeLocalizationDtos?.[index]
                      ?.position && (
                      <p className="text-red-500 text-xs mt-1">
                        {
                          errors.updateEmployeeLocalizationDtos[index].position
                            ?.message
                        }
                      </p>
                    )}
                  </div>
                  <input
                    type="hidden"
                    {...register(`updateEmployeeLocalizationDtos.${index}.id`)}
                  />
                </TabsContent>
              ))}
            </Tabs>

            <div>
              <label>{t("active_status")}</label>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Select
                    key={String(field.value)}
                    onValueChange={(v) => field.onChange(v === "true")}
                    defaultValue={String(field.value)}
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
              <label>{t("phone_number")}</label>
              <Input
                {...register("phoneNumber")}
                placeholder={t("phone_number")}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label>{t("upload_picture")}</label>
              <Input type="file" {...register("picture" as const)} />
            </div>

            <DialogFooter className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Spinner /> : t("update")}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeModal;
