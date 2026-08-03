import { api } from "./api";
import type { Employee } from "../types/employee";

export async function getEmployees(): Promise<Employee[]> {
  const response = await api.get<Employee[]>("/employees");
  return response.data;
}

export async function getEmployee(id: string): Promise<Employee> {
  const response = await api.get<Employee>(`/employees/${id}`);
  return response.data;
}

export async function createEmployee(data: Omit<Employee, "id" | "businessId" | "active" | "createdAt" | "updatedAt">): Promise<Employee> {
  const response = await api.post<Employee>("/employees", data);
  return response.data;
}

export async function updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
  const response = await api.put<Employee>(`/employees/${id}`, data);
  return response.data;
}

export async function deleteEmployee(id: string): Promise<Employee> {
  const response = await api.delete<Employee>(`/employees/${id}`);
  return response.data;
}

export async function toggleEmployeeActive(id: string): Promise<Employee> {
  const response = await api.patch<Employee>(`/employees/${id}/toggle-active`);
  return response.data;
}
