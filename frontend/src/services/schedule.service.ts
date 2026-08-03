import { api } from "./api";
import type { EmployeeSchedule } from "../types/schedule";

export async function getSchedules(): Promise<EmployeeSchedule[]> {
  const response = await api.get<EmployeeSchedule[]>("/schedules");
  return response.data;
}

export async function createSchedule(data: Omit<EmployeeSchedule, "id" | "createdAt" | "updatedAt">): Promise<EmployeeSchedule> {
  const response = await api.post<EmployeeSchedule>("/schedules", data);
  return response.data;
}

export async function updateSchedule(id: string, data: Partial<EmployeeSchedule>): Promise<EmployeeSchedule> {
  const response = await api.put<EmployeeSchedule>(`/schedules/${id}`, data);
  return response.data;
}

export async function deleteSchedule(id: string): Promise<void> {
  await api.delete(`/schedules/${id}`);
}
