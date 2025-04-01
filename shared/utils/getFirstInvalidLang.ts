export const getFirstInvalidLang = (
    errors: { [key: string]: { [index: number]: boolean } } | null,
    fieldKey: string = "companyLocalizationDtos"
  ): string | null => {
    if (!errors || !errors[fieldKey]) return null;
  
    const langs = ["az", "en", "ru"];
    for (let i = 0; i < langs.length; i++) {
      if (errors[fieldKey]?.[i]) {
        return langs[i];
      }
    }
  
    return null;
  };
  