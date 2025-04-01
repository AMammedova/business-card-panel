export interface EmployeeInfo {
  employeeId: number;
  employeeName: string;
}

export interface QrCode {
  id: number;
  slug: string;
  vCodeUrl: string;
  qrCodeUrl: string;
  baseUrl: string;
  createdAt: string;
  getEmployeeInfoForQrCodes: EmployeeInfo;
}

export interface QrCodeResponse {
  data: {
    items: QrCode[];
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
