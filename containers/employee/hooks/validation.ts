import { useTranslations } from "next-intl";
import * as z from "zod";
export const useEmployeeSchema = () => {
  const t = useTranslations("employees.validation");

  return z.object({
    isActive: z.boolean(),
    phoneNumber: z
      .string()
      .min(1, t("phone_required")), 
    employeeLocalizationDtos: z.array(
      z.object({
        name: z.string().min(1, t("name_required")),
        surname: z.string().min(1, t("surname_required")),
        mail: z.string().email(t("email_invalid")),
        position: z.string().min(1, t("position_required")),
        language: z.enum(["az", "en", "ru"]),
      })
    ),
    companyIds: z
      .array(z.number())
      .min(1, t("company_required")), 
    picture: z.any().optional(),
  });
};
