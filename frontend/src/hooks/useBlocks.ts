import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as blockService from "../services/block.service";

export function useBlocks() {
  return useQuery({
    queryKey: ["blocks"],
    queryFn: blockService.getBlocks
  });
}

export function useCreateBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blockService.createBlock,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["blocks"] });
      toast.success("Bloqueo creado");
    },
    onError: () => {
      toast.error("Error al crear el bloqueo");
    }
  });
}

export function useDeleteBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blockService.deleteBlock,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["blocks"] });
      toast.success("Bloqueo eliminado");
    },
    onError: () => {
      toast.error("Error al eliminar el bloqueo");
    }
  });
}
