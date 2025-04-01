export interface SiteLocalizationDto {
    id: number;
    name: string;
    slogan: string;
    email: string;
    location: string;
    phoneNumber: string;
    language: string;
  }
  
  export interface Site {
    id: number;
    isShow: boolean;
    startDate: string; // ISO formatda tarix
    companyLocalizationDtos: SiteLocalizationDto[];
  }
  
  export interface SiteResponse {
    items: Site[];
    pageNumber: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }
  