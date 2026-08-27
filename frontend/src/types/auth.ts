export interface User {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin";
  businessId: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}
