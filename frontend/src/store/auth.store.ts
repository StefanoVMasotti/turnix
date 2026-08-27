import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/auth";
import * as authService from "../services/auth.service";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await authService.login({ email, password });
        set({
          user: response.user,
          token: response.access_token,
          isAuthenticated: true
        });
      },

      logout: () => {
        authService.logout().catch(() => {});
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
        window.location.href = "/login";
      },

      setUser: (user: User) => {
        set({ user });
      }
    }),
    {
      name: "turnix-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
