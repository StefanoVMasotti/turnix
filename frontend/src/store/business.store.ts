import { create } from "zustand";

interface BusinessState {
  businessId: string;
  setBusinessId: (id: string) => void;
}

const defaultBusinessId = "11111111-1111-4111-8111-111111111111";

export const useBusinessStore = create<BusinessState>((set) => ({
  businessId: (import.meta.env.VITE_BUSINESS_ID as string | undefined) ?? defaultBusinessId,
  setBusinessId: (id: string) => { set({ businessId: id }); }
}));
