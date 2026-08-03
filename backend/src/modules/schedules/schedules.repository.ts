import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";

@Injectable()
export class SchedulesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByBusinessId(businessId: string) {
    return this.prisma.employeeSchedule.findMany({
      where: {
        employee: { businessId }
      },
      include: { employee: true },
      orderBy: { createdAt: "desc" }
    });
  }

  async findById(id: string) {
    return this.prisma.employeeSchedule.findUnique({
      where: { id }
    });
  }

  async create(data: CreateScheduleDto) {
    return this.prisma.employeeSchedule.create({
      data: {
        employeeId: data.employeeId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime
      }
    });
  }

  async update(id: string, data: UpdateScheduleDto) {
    return this.prisma.employeeSchedule.update({
      where: { id },
      data: {
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime
      }
    });
  }

  async delete(id: string) {
    return this.prisma.employeeSchedule.delete({
      where: { id }
    });
  }
}
