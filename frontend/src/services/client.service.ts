import { api } from "./api";
import type { Client } from "../types/client";

export async function getClients(): Promise<Client[]> {
  const response = await api.get<Client[]>("/clients");
  return response.data;
}

export async function getClient(id: string): Promise<Client> {
  const response = await api.get<Client>(`/clients/${id}`);
  return response.data;
}

export async function createClient(data: Omit<Client, "id" | "businessId" | "createdAt" | "updatedAt">): Promise<Client> {
  const response = await api.post<Client>("/clients", data);
  return response.data;
}

export async function updateClient(id: string, data: Partial<Client>): Promise<Client> {
  const response = await api.put<Client>(`/clients/${id}`, data);
  return response.data;
}
