import { api } from "./api";
import type { EmployeeTimeOff } from "../types/time-off";

export async function getTimeOff(): Promise<EmployeeTimeOff[]> {
  const response = await api.get<EmployeeTimeOff[]>("/time-off");
  return response.data;
}

export async function createTimeOff(data: Omit<EmployeeTimeOff, "id" | "createdAt" | "updatedAt">): Promise<EmployeeTimeOff> {
  const response = await api.post<EmployeeTimeOff>("/time-off", data);
  return response.data;
}

export async function deleteTimeOff(id: string): Promise<void> {
  await api.delete(`/time-off/${id}`);
}
