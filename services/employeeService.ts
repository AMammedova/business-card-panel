import apiClient from "@/lib/apiClient";
import { CreateEmployeePayload, Employee } from "@/shared/types/employee";

interface EmployeeParams {
  companyId?: number;
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}

export const fetchEmployees = async ({
  companyId,
  pageNumber = 1,
  pageSize = 10,
  search,
  isActive,
}: EmployeeParams) => {
  const params = new URLSearchParams();
  if (companyId) params.append("companyId", companyId.toString());
  params.append("pageNumber", pageNumber.toString());
  params.append("pageSize", pageSize.toString());
  if (search) params.append("search", search);
  if (isActive !== undefined) params.append("isActive", isActive.toString());

  const response = await apiClient.get(
    `/employees/get-all-pagination?${params.toString()}`
  );
  return response.data.data;
};

export const fetchAllEmployees = async (): Promise<Employee[]> => {
  const response = await apiClient.get("/employees/get-all");
  return response.data.data;
};

export const fetchEmployeeById = async (
  employeeId: number
): Promise<Employee> => {
  const response = await apiClient.get(`/employees/get/${employeeId}`);
  return response.data.data;
};

export const createEmployee = async (employeeData: CreateEmployeePayload) => {
  const formData = new FormData();

  formData.append("isActive", String(employeeData.isActive));
  if (employeeData.phoneNumber)
    formData.append("phoneNumber", employeeData.phoneNumber);

  employeeData.companyIds.forEach((id) => {
    formData.append("companyIds", String(id));
  });

  employeeData.employeeLocalizationDtos.forEach((localization, index) => {
    formData.append(
      `employeeLocalizationDtos[${index}][name]`,
      localization.name
    );
    formData.append(
      `employeeLocalizationDtos[${index}][surname]`,
      localization.surname
    );
    formData.append(
      `employeeLocalizationDtos[${index}][mail]`,
      localization.mail
    );
    formData.append(
      `employeeLocalizationDtos[${index}][position]`,
      localization.position
    );
    formData.append(
      `employeeLocalizationDtos[${index}][language]`,
      localization.language
    );
  });

  if (employeeData.picture) {
    formData.append("picture", employeeData.picture);
  }

  const response = await apiClient.post("/employees/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const updateEmployee = (employeeId: number, formData: FormData) => {
  return apiClient.put(`/employees/update`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteEmployee = async (employeeId: number) => {
  const response = await apiClient.delete(`/employees/delete/${employeeId}`);
  return response.data;
};
