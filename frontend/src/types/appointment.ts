export type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "no_show";

export interface Appointment {
  id: string;
  businessId: string;
  clientId: string;
  employeeId: string;
  serviceId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  bookingSource?: "web" | "whatsapp" | "phone" | "walk_in";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  client?: { firstName: string; lastName: string; phone: string };
  employee?: { firstName: string; lastName: string };
  service?: { name: string; durationMinutes: number };
}

export type CreateAppointmentPayload = Omit<Appointment, "id" | "businessId" | "status" | "createdAt" | "updatedAt" | "client" | "employee" | "service">;
