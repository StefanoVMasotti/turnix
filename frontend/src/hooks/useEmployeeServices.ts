import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as employeeServiceService from "../services/employee-service.service";
import type { EmployeeService } from "../types/employee-service";

export function useEmployeeServices() {
  return useQuery({
    queryKey: ["employeeServices"],
    queryFn: employeeServiceService.getEmployeeServices
  });
}

export function useCreateEmployeeService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeServiceService.createEmployeeService,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["employeeServices"] });
      toast.success("Asignación creada");
    },
    onError: () => {
      toast.error("Error al crear la asignación");
    }
  });
}

export function useUpdateEmployeeService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmployeeService> }) =>
      employeeServiceService.updateEmployeeService(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["employeeServices"] });
      toast.success("Asignación actualizada");
    },
    onError: () => {
      toast.error("Error al actualizar la asignación");
    }
  });
}

export function useToggleEmployeeServiceActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeServiceService.toggleEmployeeServiceActive,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["employeeServices"] });
      toast.success("Asignación actualizada");
    },
    onError: () => {
      toast.error("Error al actualizar la asignación");
    }
  });
}

export function useDeleteEmployeeService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeServiceService.deleteEmployeeService,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["employeeServices"] });
      toast.success("Asignación eliminada");
    },
    onError: () => {
      toast.error("Error al eliminar la asignación");
    }
  });
}
