import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as timeOffService from "../services/time-off.service";

export function useTimeOff() {
  return useQuery({
    queryKey: ["timeOff"],
    queryFn: timeOffService.getTimeOff
  });
}

export function useCreateTimeOff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: timeOffService.createTimeOff,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["timeOff"] });
      toast.success("Permiso creado");
    },
    onError: () => {
      toast.error("Error al crear el permiso");
    }
  });
}

export function useDeleteTimeOff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: timeOffService.deleteTimeOff,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["timeOff"] });
      toast.success("Permiso eliminado");
    },
    onError: () => {
      toast.error("Error al eliminar el permiso");
    }
  });
}
