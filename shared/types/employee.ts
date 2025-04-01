type EmployeeLocalization = {
  id: number;
  name: string;
  surname: string;
  mail: string;
  position: string;
  language: string;
};
export type CreateEmployeeLocalization = {
  name: string;
  surname: string;
  mail: string;
  position: string;
  language: string;
};

export type Employee = {
  id: number;
  isActive: boolean;
  phoneNumber: string | null;
  pictureUrl: string;
  companyNames: string[];
  employeeLocalizations: EmployeeLocalization[];
};

export interface EmployeeParams {
  companyId?: number;
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}
export interface CreateEmployeePayload {
  isActive: boolean;
  phoneNumber?: string;
  companyIds: number[];
  employeeLocalizationDtos: CreateEmployeeLocalization[];
  picture?: File | null;
}


export interface UpdateEmployeePayload {
  isActive?: boolean;
  phoneNumber?: string;
  employeeLocalizationDtos?: EmployeeLocalization[];
  picture?: File | null;
}

export interface UpdateEmployeePayloadForm {
  employeeId: number;
  employeeData: FormData;
}
