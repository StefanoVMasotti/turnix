export interface PublicBusiness {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  email: string | null;
  address: string | null;
}

export interface PublicSettings {
  timezone: string;
  currency: string;
  maxBookingDays: number;
}

export interface PublicServiceEmployee {
  employeeId: string;
  firstName: string;
  lastName: string;
  price: string;
}

export interface PublicService {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  employees: PublicServiceEmployee[];
}

export interface PublicEmployee {
  id: string;
  firstName: string;
  lastName: string;
}

export interface PublicLanding {
  business: PublicBusiness;
  settings: PublicSettings;
  services: PublicService[];
  employees: PublicEmployee[];
}

export interface AvailabilityDay {
  date: string;
  available: boolean;
  slotsCount: number;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface PublicAppointment {
  id: string;
  businessId: string;
  clientId: string;
  employeeId: string;
  serviceId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  bookingSource: string;
  notes: string | null;
  client?: { firstName: string; lastName: string; phone: string };
  employee?: { firstName: string; lastName: string };
  service?: { name: string; durationMinutes: number };
}

export interface PublicClientPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface CreatePublicAppointmentPayload {
  serviceId: string;
  employeeId: string;
  appointmentDate: string;
  startTime: string;
  client: PublicClientPayload;
}
