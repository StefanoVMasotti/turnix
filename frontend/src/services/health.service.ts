import { api } from "./api";

export type HealthResponse = {
  status: "ok";
  service: "turnix-api";
};

export async function getHealth(): Promise<HealthResponse> {
  const response = await api.get<HealthResponse>("/health");
  return response.data;
}
