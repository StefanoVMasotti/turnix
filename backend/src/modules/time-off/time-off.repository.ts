import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateTimeOffDto } from "./dto/create-time-off.dto";

@Injectable()
export class TimeOffRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByBusinessId(businessId: string) {
    return this.prisma.employeeTimeOff.findMany({
      where: {
        employee: { businessId }
      },
      include: { employee: true },
      orderBy: { createdAt: "desc" }
    });
  }

  async findById(id: string) {
    return this.prisma.employeeTimeOff.findUnique({
      where: { id }
    });
  }

  async create(data: CreateTimeOffDto) {
    return this.prisma.employeeTimeOff.create({
      data: {
        employeeId: data.employeeId,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason
      }
    });
  }

  async delete(id: string) {
    return this.prisma.employeeTimeOff.delete({
      where: { id }
    });
  }
}
