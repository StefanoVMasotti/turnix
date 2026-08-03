import { publicApi } from "./publicApi";
import type {
  AvailabilityDay,
  CreatePublicAppointmentPayload,
  PublicAppointment,
  PublicLanding,
  TimeSlot
} from "../types/public";

export async function getPublicLanding(slug: string): Promise<PublicLanding> {
  const response = await publicApi.get<PublicLanding>(`/public/${slug}`);
  return response.data;
}

export async function getAvailabilityDays(
  slug: string,
  serviceId: string,
  employeeId?: string
): Promise<AvailabilityDay[]> {
  const response = await publicApi.get<{ days: AvailabilityDay[] }>(`/public/${slug}/availability`, {
    params: { serviceId, ...(employeeId ? { employeeId } : {}) }
  });
  return response.data.days;
}

export async function getAvailabilitySlots(
  slug: string,
  serviceId: string,
  date: string,
  employeeId?: string
): Promise<TimeSlot[]> {
  const response = await publicApi.get<{ date: string; slots: TimeSlot[] }>(
    `/public/${slug}/availability`,
    {
      params: { serviceId, date, ...(employeeId ? { employeeId } : {}) }
    }
  );
  return response.data.slots;
}

export async function createPublicAppointment(
  slug: string,
  data: CreatePublicAppointmentPayload
): Promise<PublicAppointment> {
  const response = await publicApi.post<PublicAppointment>(`/public/${slug}/appointments`, data);
  return response.data;
}
