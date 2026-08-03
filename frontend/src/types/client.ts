export interface Client {
  id: string;
  businessId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
