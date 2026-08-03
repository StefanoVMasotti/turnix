import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";

@Injectable()
export class EmployeesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByBusinessId(businessId: string) {
    return this.prisma.employee.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" }
    });
  }

  async findById(id: string) {
    return this.prisma.employee.findUnique({
      where: { id }
    });
  }

  async create(businessId: string, data: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: {
        businessId,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email
      }
    });
  }

  async update(id: string, data: UpdateEmployeeDto) {
    return this.prisma.employee.update({
      where: { id },
      data
    });
  }

  async softDelete(id: string) {
    return this.prisma.employee.update({
      where: { id },
      data: { active: false }
    });
  }

  async toggleActive(id: string) {
    const employee = await this.findById(id);
    return this.prisma.employee.update({
      where: { id },
      data: { active: !employee?.active }
    });
  }
}
