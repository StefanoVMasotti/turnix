import { ConflictException, Injectable } from "@nestjs/common";
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
    try {
      return await this.prisma.client.create({
        data: {
          businessId,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email,
          notes: data.notes
        }
      });
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code: string }).code === "P2002"
      ) {
        throw new ConflictException("Ya existe un cliente con ese teléfono en este negocio.");
      }
      throw error;
    }
  }

  async update(id: string, data: UpdateClientDto) {
    return this.prisma.client.update({
      where: { id },
      data
    });
  }
}
