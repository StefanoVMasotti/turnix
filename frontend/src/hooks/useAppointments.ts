import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as appointmentService from "../services/appointment.service";
import type { Appointment, AppointmentStatus } from "../types/appointment";

export interface UseAppointmentsParams {
  clientId?: string;
  page?: number;
  limit?: number;
  status?: AppointmentStatus;
  dateFrom?: string;
  dateTo?: string;
}

export function useAppointments(params?: UseAppointmentsParams) {
  return useQuery({
    queryKey: ["appointments", params ?? {}],
    queryFn: () => appointmentService.getAppointments(params)
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appointmentService.createAppointment,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Turno creado");
    },
    onError: () => {
      toast.error("Error al crear el turno");
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
      toast.success("Turno actualizado");
    },
    onError: () => {
      toast.error("Error al actualizar el turno");
    }
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: appointmentService.deleteAppointment,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Turno eliminado");
    },
    onError: () => {
      toast.error("Error al eliminar el turno");
    }
  });
}
