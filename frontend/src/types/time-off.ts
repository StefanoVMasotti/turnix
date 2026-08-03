export interface EmployeeTimeOff {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
}
