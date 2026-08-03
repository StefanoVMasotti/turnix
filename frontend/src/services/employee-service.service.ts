import { api } from "./api";
import type { EmployeeService } from "../types/employee-service";

export async function getEmployeeServices(): Promise<EmployeeService[]> {
  const response = await api.get<EmployeeService[]>("/employee-services");
  return response.data;
}

export async function createEmployeeService(data: Omit<EmployeeService, "id" | "active" | "createdAt" | "updatedAt">): Promise<EmployeeService> {
  const response = await api.post<EmployeeService>("/employee-services", data);
  return response.data;
}

export async function deleteEmployeeService(id: string): Promise<EmployeeService> {
  const response = await api.delete<EmployeeService>(`/employee-services/${id}`);
  return response.data;
}
