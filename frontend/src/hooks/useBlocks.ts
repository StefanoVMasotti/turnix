import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    }
  });
}

export function useDeleteBlock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blockService.deleteBlock,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["blocks"] });
    }
  });
}
