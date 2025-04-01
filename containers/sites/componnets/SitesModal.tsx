"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import * as z from "zod";
import { useSaveSite } from "@/hooks/api/useSites";

interface CompanyLocalizationDto {
  id: number;
  name: string;
}
interface Company {
  id: number;
  companyLocalizationDtos: CompanyLocalizationDto[];
}

interface SitesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedSite?: { id?: number; url?: string; companyId?: number } | null;
  companies: Company[];
}

const SitesModal: React.FC<SitesModalProps> = ({
  open,
  setOpen,
  selectedSite,
  companies,
}) => {
  const t = useTranslations("sites");

  const schema = z.object({
    url: z
      .string()
      .min(5, { message: t("url_validation_error") })
      .url({ message: t("url_validation_error") }),
    companyId: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z
        .number({
          required_error: t("company_validation_error"),
          invalid_type_error: t("company_validation_error"),
        })
        .min(1, t("company_validation_error"))
    ),
  });

  type SiteFormData = z.infer<typeof schema>;

  const { mutate: saveSite, isPending } = useSaveSite();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<SiteFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      url: "",
      companyId: undefined,
    },
  });

  useEffect(() => {
    if (selectedSite) {
      reset({
        url: selectedSite.url || "",
        companyId: selectedSite.companyId ?? undefined,
      });
    } else {
      reset({
        url: "",
        companyId: undefined,
      });
    }
  }, [selectedSite, reset]);

  const onSubmit = (data: SiteFormData) => {
    saveSite(
      {
        id: selectedSite?.id,
        ...data,
      },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col gap-4">
        <DialogTitle>
          {selectedSite?.id ? t("edit_site") : t("add_site")}
        </DialogTitle>

        {/* URL Input */}
        <div>
          <Input {...register("url")} placeholder={t("site_url_placeholder")} />
          {errors.url && (
            <p className="text-red-500 text-sm mt-1">{errors.url.message}</p>
          )}
        </div>

        {/* Company Select */}
        <div>
          <Select
            onValueChange={(value) => setValue("companyId", Number(value))}
            value={watch("companyId") ? watch("companyId")?.toString() : ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("select_company")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t("companies")}</SelectLabel>
                {companies?.map((company) => (
                  <SelectItem key={company.id} value={company.id.toString()}>
                    {company.companyLocalizationDtos[0]?.name ||
                      `${t("company")} ${company.id}`}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.companyId && (
            <p className="text-red-500 text-sm mt-1">
              {errors.companyId.message}
            </p>
          )}
        </div>

        <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
          {selectedSite?.id ? t("edit_site") : t("add_site")}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SitesModal;
