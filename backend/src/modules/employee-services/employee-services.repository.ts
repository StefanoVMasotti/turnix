import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateEmployeeServiceDto } from "./dto/create-employee-service.dto";

@Injectable()
export class EmployeeServicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByBusinessId(businessId: string) {
    return this.prisma.employeeService.findMany({
      where: {
        employee: { businessId },
        active: true
      },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true } },
        service: { select: { id: true, name: true, durationMinutes: true } }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async findById(id: string) {
    return this.prisma.employeeService.findUnique({
      where: { id }
    });
  }

  async findByEmployeeAndService(employeeId: string, serviceId: string) {
    return this.prisma.employeeService.findUnique({
      where: {
        employeeId_serviceId: { employeeId, serviceId }
      }
    });
  }

  async create(data: CreateEmployeeServiceDto) {
    return this.prisma.employeeService.create({
      data: {
        employeeId: data.employeeId,
        serviceId: data.serviceId,
        price: data.price
      }
    });
  }

  async softDelete(id: string) {
    return this.prisma.employeeService.update({
      where: { id },
      data: { active: false }
    });
  }
}
