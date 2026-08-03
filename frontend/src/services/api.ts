import axios from "axios";
import { useBusinessStore } from "../store/business.store";

const apiUrl: string = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const businessId = useBusinessStore.getState().businessId;

  if (businessId) {
    config.headers["x-business-id"] = businessId;
  }

  return config;
});
