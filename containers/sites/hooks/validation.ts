import { useTranslations } from "next-intl";
import * as z from "zod";
export const useSiteSchema = () => {
  const t = useTranslations("sites");

  return z.object({
    url: z.string().min(5, "").url(t("url_validation_error")),
    companyId: z.number().min(1, t("company_validation_error")),
  });
};

export type SiteFormData = z.infer<ReturnType<typeof useSiteSchema>>;
