import { api } from "./api";
import type { Appointment, CreateAppointmentPayload } from "../types/appointment";

export async function getAppointments(clientId?: string): Promise<Appointment[]> {
  const response = await api.get<Appointment[]>("/appointments", {
    params: clientId ? { clientId } : undefined
  });
  return response.data;
}

export async function createAppointment(data: CreateAppointmentPayload): Promise<Appointment> {
  const response = await api.post<Appointment>("/appointments", data);
  return response.data;
}

export async function updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
  const response = await api.put<Appointment>(`/appointments/${id}`, data);
  return response.data;
}

export async function deleteAppointment(id: string): Promise<void> {
  await api.delete(`/appointments/${id}`);
}
