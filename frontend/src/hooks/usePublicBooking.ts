import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as publicService from "../services/public.service";
import type {
  CreatePublicAppointmentPayload,
  PublicAppointment
} from "../types/public";

export function usePublicLanding(slug: string) {
  return useQuery({
    queryKey: ["public", slug, "landing"],
    queryFn: () => publicService.getPublicLanding(slug),
    enabled: Boolean(slug)
  });
}

export function useAvailabilityDays(slug: string, serviceId: string, employeeId?: string) {
  return useQuery({
    queryKey: ["public", slug, "days", serviceId, employeeId ?? "any"],
    queryFn: () => publicService.getAvailabilityDays(slug, serviceId, employeeId),
    enabled: Boolean(slug) && Boolean(serviceId)
  });
}

export function useAvailabilitySlots(
  slug: string,
  serviceId: string,
  date: string,
  employeeId?: string
) {
  return useQuery({
    queryKey: ["public", slug, "slots", serviceId, date, employeeId ?? "any"],
    queryFn: () => publicService.getAvailabilitySlots(slug, serviceId, date, employeeId),
    enabled: Boolean(slug) && Boolean(serviceId) && Boolean(date)
  });
}

export function useCreatePublicAppointment(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePublicAppointmentPayload): Promise<PublicAppointment> =>
      publicService.createPublicAppointment(slug, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["public", slug] });
    }
  });
}
