import { publicApi } from "./publicApi";
import { api } from "./api";
import type { LoginPayload, LoginResponse } from "../types/auth";

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await publicApi.post<LoginResponse>("/auth/login", payload);
  return data;
}

export async function getProfile() {
  const { data } = await api.get("/auth/profile");
  return data;
}

export async function logout() {
  await api.post("/auth/logout");
}
