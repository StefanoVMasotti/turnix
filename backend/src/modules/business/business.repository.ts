import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { UpdateBusinessDto } from "./dto/update-business.dto";
import { UpdateBusinessSettingsDto } from "./dto/update-business-settings.dto";

@Injectable()
export class BusinessRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.business.findUnique({
      where: { id },
      include: { settings: true }
    });
  }

  async update(id: string, data: UpdateBusinessDto) {
    return this.prisma.business.update({
      where: { id },
      data
    });
  }

  async findSettingsByBusinessId(businessId: string) {
    return this.prisma.businessSettings.findUnique({
      where: { businessId }
    });
  }

  async updateSettings(businessId: string, data: UpdateBusinessSettingsDto) {
    return this.prisma.businessSettings.update({
      where: { businessId },
      data
    });
  }
}
