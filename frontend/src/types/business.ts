export interface Business {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessSettings {
  id: string;
  businessId: string;
  timezone: string;
  currency: string;
  appointmentInterval: number;
  maxBookingDays: number;
  createdAt: string;
  updatedAt: string;
}
