import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as appointmentService from "../services/appointment.service";
import type { Appointment } from "../types/appointment";

export function useAppointments(clientId?: string) {
  return useQuery({
    queryKey: ["appointments", clientId ?? "all"],
    queryFn: () => appointmentService.getAppointments(clientId)
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appointmentService.createAppointment,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Appointment> }) =>
      appointmentService.updateAppointment(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appointmentService.deleteAppointment,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }
  });
}
