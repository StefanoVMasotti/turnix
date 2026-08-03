import { api } from "./api";
import type { Service } from "../types/service";

export async function getServices(): Promise<Service[]> {
  const response = await api.get<Service[]>("/services");
  return response.data;
}

export async function createService(data: Omit<Service, "id" | "businessId" | "active" | "createdAt" | "updatedAt">): Promise<Service> {
  const response = await api.post<Service>("/services", data);
  return response.data;
}

export async function updateService(id: string, data: Partial<Service>): Promise<Service> {
  const response = await api.put<Service>(`/services/${id}`, data);
  return response.data;
}

export async function deleteService(id: string): Promise<Service> {
  const response = await api.delete<Service>(`/services/${id}`);
  return response.data;
}

export async function toggleServiceActive(id: string): Promise<Service> {
  const response = await api.patch<Service>(`/services/${id}/toggle-active`);
  return response.data;
}
