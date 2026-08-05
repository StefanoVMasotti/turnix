import axios from "axios";

const apiUrl: string = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export const publicApi = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json"
  }
});
