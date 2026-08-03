import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as serviceService from "../services/service.service";

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: serviceService.getServices
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: serviceService.createService,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["services"] });
    }
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof serviceService.updateService>[1] }) =>
      serviceService.updateService(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["services"] });
    }
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: serviceService.deleteService,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["services"] });
    }
  });
}

export function useToggleServiceActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: serviceService.toggleServiceActive,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["services"] });
    }
  });
}
