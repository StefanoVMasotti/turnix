import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { PublicClientDto } from "./dto/create-public-appointment.dto";

interface CreateAppointmentData {
  businessId: string;
  clientId: string;
  employeeId: string;
  serviceId: string;
  appointmentDate: Date;
  startTime: string;
  endTime: string;
  status: "scheduled";
  bookingSource: "web";
}

@Injectable()
export class PublicRepository {
  constructor(private readonly prisma: PrismaService) {}

  findBusinessBySlug(slug: string) {
    return this.prisma.business.findUnique({
      where: { slug },
      include: { settings: true }
    });
  }

  findServiceById(serviceId: string) {
    return this.prisma.service.findUnique({
      where: { id: serviceId }
    });
  }

  findActiveServicesByBusinessId(businessId: string) {
    return this.prisma.service.findMany({
      where: { businessId, active: true },
      include: {
        employeeServices: {
          where: { active: true, employee: { active: true } },
          include: {
            employee: { select: { id: true, firstName: true, lastName: true } }
          }
        }
      },
      orderBy: { name: "asc" }
    });
  }

  findActiveEmployeesByBusinessId(businessId: string) {
    return this.prisma.employee.findMany({
      where: { businessId, active: true },
      orderBy: { firstName: "asc" }
    });
  }

  findEmployeeService(employeeId: string, serviceId: string) {
    return this.prisma.employeeService.findUnique({
      where: {
        employeeId_serviceId: { employeeId, serviceId }
      },
      include: { service: true, employee: true }
    });
  }

  findEmployeeIdsByService(serviceId: string) {
    return this.prisma.employeeService.findMany({
      where: { serviceId, active: true, employee: { active: true } },
      select: { employeeId: true }
    });
  }

  findSchedulesByEmployees(employeeIds: string[]) {
    return this.prisma.employeeSchedule.findMany({
      where: { employeeId: { in: employeeIds } }
    });
  }

  findTimeOffByEmployees(employeeIds: string[], startDate: Date, endDate: Date) {
    return this.prisma.employeeTimeOff.findMany({
      where: {
        employeeId: { in: employeeIds },
        startDate: { lte: endDate },
        endDate: { gte: startDate }
      }
    });
  }

  findBlocksByEmployees(employeeIds: string[], startDate: Date, endDate: Date) {
    return this.prisma.employeeBlock.findMany({
      where: {
        employeeId: { in: employeeIds },
        blockDate: { gte: startDate, lte: endDate }
      }
    });
  }

  findAppointmentsByEmployees(employeeIds: string[], startDate: Date, endDate: Date) {
    return this.prisma.appointment.findMany({
      where: {
        employeeId: { in: employeeIds },
        appointmentDate: { gte: startDate, lte: endDate },
        status: "scheduled"
      }
    });
  }

  findClientByPhone(businessId: string, phone: string) {
    return this.prisma.client.findFirst({
      where: { businessId, phone }
    });
  }

  createClient(businessId: string, data: PublicClientDto) {
    return this.prisma.client.create({
      data: {
        businessId,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        notes: data.notes
      }
    });
  }

  updateClient(id: string, data: Partial<PublicClientDto>) {
    return this.prisma.client.update({
      where: { id },
      data
    });
  }

  createAppointment(data: CreateAppointmentData) {
    return this.prisma.appointment.create({ data });
  }

  findAppointmentById(id: string) {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: {
        client: { select: { firstName: true, lastName: true, phone: true } },
        employee: { select: { firstName: true, lastName: true } },
        service: { select: { name: true, durationMinutes: true } }
      }
    });
  }
}
