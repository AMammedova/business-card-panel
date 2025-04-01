export interface CompanyLocalizationDto {
  id: number;
  name: string;
  slogan?: string;
  info?: string;
  email: string;
  location: string;
  phoneNumber: string;
  language: "az" | "en" | "ru";
}
export interface AddCompanyLocalizationDto {
  name: string;
  slogan?: string;
  info?: string;
  email: string;
  location: string;
  phoneNumber: string;
  language: "az" | "en" | "ru";
}

export interface Company {
  id: number;
  isShow: boolean;
  startDate: string;
  companyLocalizationDtos: CompanyLocalizationDto[];
}

export interface CompanyResponse {
  items: Company[];
  pageNumber: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateCompanyPayload {
  companyLocalizationDtos: AddCompanyLocalizationDto[];
  isShow: boolean;
  startDate: string;
}

// The one you need for updates:
export interface UpdateCompanyPayload {
  updateCompanyLocalizationDto: CompanyLocalizationDto[];
  isShow: boolean;
  startDate: string;
}
