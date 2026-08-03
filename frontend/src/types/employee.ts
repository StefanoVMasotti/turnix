export interface Employee {
  id: string;
  businessId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
