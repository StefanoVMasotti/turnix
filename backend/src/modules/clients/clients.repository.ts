import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";

@Injectable()
export class ClientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByBusinessId(businessId: string) {
    return this.prisma.client.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" }
    });
  }

  async findById(id: string) {
    return this.prisma.client.findUnique({
      where: { id }
    });
  }

  async create(businessId: string, data: CreateClientDto) {
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

  async update(id: string, data: UpdateClientDto) {
    return this.prisma.client.update({
      where: { id },
      data
    });
  }
}
