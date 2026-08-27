import { create } from "zustand";
import { useAuthStore } from "./auth.store";

interface BusinessState {
  businessId: string;
  setBusinessId: (id: string) => void;
}

export const useBusinessStore = create<BusinessState>((set) => ({
  businessId: useAuthStore.getState().user?.businessId ?? "11111111-1111-4111-8111-111111111111",
  setBusinessId: (id: string) => { set({ businessId: id }); }
}));

useAuthStore.subscribe((state) => {
  if (state.user?.businessId) {
    useBusinessStore.getState().setBusinessId(state.user.businessId);
  }
});
