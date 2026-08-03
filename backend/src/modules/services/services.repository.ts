import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";

@Injectable()
export class ServicesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByBusinessId(businessId: string) {
    return this.prisma.service.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" }
    });
  }

  async findById(id: string) {
    return this.prisma.service.findUnique({
      where: { id }
    });
  }

  async create(businessId: string, data: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        businessId,
        name: data.name,
        description: data.description,
        durationMinutes: data.durationMinutes
      }
    });
  }

  async update(id: string, data: UpdateServiceDto) {
    return this.prisma.service.update({
      where: { id },
      data
    });
  }

  async softDelete(id: string) {
    return this.prisma.service.update({
      where: { id },
      data: { active: false }
    });
  }

  async toggleActive(id: string) {
    const service = await this.findById(id);
    return this.prisma.service.update({
      where: { id },
      data: { active: !service?.active }
    });
  }
}
