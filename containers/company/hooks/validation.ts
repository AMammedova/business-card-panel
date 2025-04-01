import { useTranslations } from "next-intl";
import * as z from "zod";
export const useCompanySchema = () => {
  const t = useTranslations("companies.validation");

  return z.object({
    companyLocalizationDtos: z.array(
      z.object({
        name: z.string().min(1, t("company_name_required")),
        slogan: z.string().optional(),
        email: z.string().email(t("invalid_email")),
        location: z.string().min(1, t("location_required")),
        phoneNumber: z.string().min(1, t("phone_required")),
        language: z.enum(["az", "en", "ru"]),
      })
    ),
    isShow: z.boolean(),
    startDate: z.string().min(1, t("start_date_required")),
  });
};

export type FormValues = z.infer<ReturnType<typeof useCompanySchema>>;
