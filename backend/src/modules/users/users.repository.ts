import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByBusinessId(businessId: string) {
    return this.prisma.user.findMany({
      where: { businessId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async findByAuthUserId(authUserId: string) {
    return this.prisma.user.findUnique({
      where: { authUserId }
    });
  }

  async create(dto: CreateUserDto, authUserId: string) {
    return this.prisma.user.create({
      data: {
        authUserId,
        name: dto.name,
        email: dto.email,
        role: dto.role,
        businessId: dto.businessId
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async softDelete(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { active: false },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }
}
