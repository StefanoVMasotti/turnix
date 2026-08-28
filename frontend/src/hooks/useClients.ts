import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as clientService from "../services/client.service";

export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: clientService.getClients
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clientService.createClient,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente creado");
    },
    onError: () => {
      toast.error("Error al crear el cliente");
    }
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof clientService.updateClient>[1] }) =>
      clientService.updateClient(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cliente actualizado");
    },
    onError: () => {
      toast.error("Error al actualizar el cliente");
    }
  });
}
