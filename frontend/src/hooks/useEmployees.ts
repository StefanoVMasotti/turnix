import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as employeeService from "../services/employee.service";

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: employeeService.getEmployees
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeService.createEmployee,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["employees"] });
    }
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof employeeService.updateEmployee>[1] }) =>
      employeeService.updateEmployee(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["employees"] });
    }
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeService.deleteEmployee,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["employees"] });
    }
  });
}

export function useToggleEmployeeActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeService.toggleEmployeeActive,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["employees"] });
    }
  });
}
