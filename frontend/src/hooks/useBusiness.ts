import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as businessService from "../services/business.service";

export function useBusiness() {
  return useQuery({
    queryKey: ["business"],
    queryFn: businessService.getBusiness
  });
}

export function useUpdateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: businessService.updateBusiness,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["business"] });
    }
  });
}

export function useBusinessSettings() {
  return useQuery({
    queryKey: ["businessSettings"],
    queryFn: businessService.getBusinessSettings
  });
}

export function useUpdateBusinessSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: businessService.updateBusinessSettings,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["businessSettings"] });
    }
  });
}
