import { api } from "./api";
import type { Appointment, CreateAppointmentPayload } from "../types/appointment";

export interface AppointmentsParams {
  clientId?: string;
  page?: number;
  limit?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginatedAppointmentsResponse {
  data: Appointment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function getAppointments(params?: AppointmentsParams): Promise<PaginatedAppointmentsResponse> {
  const response = await api.get<PaginatedAppointmentsResponse>("/appointments", { params });
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
