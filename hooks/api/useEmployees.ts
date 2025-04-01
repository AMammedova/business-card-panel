import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEmployee,
  deleteEmployee,
  fetchAllEmployees,
  fetchEmployees,
  fetchEmployeeById,
  updateEmployee,
} from "@/services/employeeService";
import { toast } from "react-toastify";
import {
  CreateEmployeePayload,
  UpdateEmployeePayloadForm,
} from "@/shared/types/employee";
import { useTranslations } from "next-intl";

interface EmployeeParams {
  companyId?: number;
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}

export const useEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: () => fetchAllEmployees(),
  });
};

export const usePaginationEmployees = ({
  companyId,
  pageNumber = 1,
  pageSize = 10,
  search,
  isActive,
}: EmployeeParams) => {
  return useQuery({
    queryKey: ["employees", companyId, pageNumber, pageSize, search, isActive],
    queryFn: () =>
      fetchEmployees({ companyId, pageNumber, pageSize, search, isActive }),
  });
};

export const useEmployeeById = (employeeId?: number) => {
  return useQuery({
    queryKey: ["employee", employeeId],
    queryFn: () => (employeeId ? fetchEmployeeById(employeeId) : null),
    enabled: !!employeeId,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("employees");

  return useMutation({
    mutationFn: (employeeData: CreateEmployeePayload) =>
      createEmployee(employeeData),
    onSuccess: () => {
      toast.success(t("create_success", { defaultValue: "İşçi uğurla əlavə olundu!" }));
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: () =>
      toast.error(t("create_error", { defaultValue: "İşçi əlavə edilə bilmədi!" })),
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("employees");

  return useMutation({
    mutationFn: ({ employeeId, employeeData }: UpdateEmployeePayloadForm) =>
      updateEmployee(employeeId, employeeData),
    onSuccess: () => {
      toast.success(t("update_success", { defaultValue: "İşçi yeniləndi!" }));
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: () =>
      toast.error(t("update_error", { defaultValue: "İşçini yeniləmək mümkün olmadı!" })),
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("employees");

  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: (data) => {
      toast.success(
        data.message?.[0] || t("delete_success", { defaultValue: "İşçi silindi!" })
      );
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(
        error.response?.data?.message ||
          t("delete_error", { defaultValue: "İşçi silinərkən xəta baş verdi!" })
      );
    },
  });
};
