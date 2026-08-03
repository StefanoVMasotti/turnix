export interface Service {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
