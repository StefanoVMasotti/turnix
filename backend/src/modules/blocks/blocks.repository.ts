import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateBlockDto } from "./dto/create-block.dto";

@Injectable()
export class BlocksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByBusinessId(businessId: string) {
    return this.prisma.employeeBlock.findMany({
      where: {
        employee: { businessId }
      },
      include: { employee: true },
      orderBy: { createdAt: "desc" }
    });
  }

  async findById(id: string) {
    return this.prisma.employeeBlock.findUnique({
      where: { id }
    });
  }

  async create(data: CreateBlockDto) {
    return this.prisma.employeeBlock.create({
      data: {
        employeeId: data.employeeId,
        blockDate: new Date(data.blockDate),
        startTime: data.startTime,
        endTime: data.endTime,
        reason: data.reason
      }
    });
  }

  async delete(id: string) {
    return this.prisma.employeeBlock.delete({
      where: { id }
    });
  }
}
