import { api } from "./api";
import type { Business, BusinessSettings } from "../types/business";

export async function getBusiness(): Promise<Business> {
  const response = await api.get<Business>("/business");
  return response.data;
}

export async function updateBusiness(data: Partial<Business>): Promise<Business> {
  const response = await api.put<Business>("/business", data);
  return response.data;
}

export async function getBusinessSettings(): Promise<BusinessSettings> {
  const response = await api.get<BusinessSettings>("/business/settings");
  return response.data;
}

export async function updateBusinessSettings(data: Partial<BusinessSettings>): Promise<BusinessSettings> {
  const response = await api.put<BusinessSettings>("/business/settings", data);
  return response.data;
}
