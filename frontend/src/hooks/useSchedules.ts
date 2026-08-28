import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as scheduleService from "../services/schedule.service";

export function useSchedules() {
  return useQuery({
    queryKey: ["schedules"],
    queryFn: scheduleService.getSchedules
  });
}

export function useCreateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: scheduleService.createSchedule,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast.success("Horario creado");
    },
    onError: () => {
      toast.error("Error al crear el horario");
    }
  });
}

export function useUpdateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof scheduleService.updateSchedule>[1] }) =>
      scheduleService.updateSchedule(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast.success("Horario actualizado");
    },
    onError: () => {
      toast.error("Error al actualizar el horario");
    }
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: scheduleService.deleteSchedule,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast.success("Horario eliminado");
    },
    onError: () => {
      toast.error("Error al eliminar el horario");
    }
  });
}
