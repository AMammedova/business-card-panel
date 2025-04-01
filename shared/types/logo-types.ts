// shared/types/logo-types.ts

export interface Logo {
    id: number;
    url: string;
    companyName: string;
    companyId: number;
    isActive: boolean;
  }
  
  export interface LogoResponse {
    data: {
      items: Logo[];
      pageNumber: number;
      totalPages: number;
      pageSize: number;
      totalCount: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
    message: string | null;
    statusCode: number;
  }
  