export interface EmployeeService {
  id: string;
  employeeId: string;
  serviceId: string;
  price: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  employee?: { id: string; firstName: string; lastName: string };
  service?: { id: string; name: string; durationMinutes: number };
}
