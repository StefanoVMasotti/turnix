import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
      toast.success("Empleado creado");
    },
    onError: () => {
      toast.error("Error al crear el empleado");
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
      toast.success("Empleado actualizado");
    },
    onError: () => {
      toast.error("Error al actualizar el empleado");
    }
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeService.deleteEmployee,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Empleado eliminado");
    },
    onError: () => {
      toast.error("Error al eliminar el empleado");
    }
  });
}

export function useToggleEmployeeActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeService.toggleEmployeeActive,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Empleado actualizado");
    },
    onError: () => {
      toast.error("Error al actualizar el empleado");
    }
  });
}
