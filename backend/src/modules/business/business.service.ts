import { Injectable, NotFoundException } from "@nestjs/common";
import { BusinessRepository } from "./business.repository";
import { UpdateBusinessDto } from "./dto/update-business.dto";
import { UpdateBusinessSettingsDto } from "./dto/update-business-settings.dto";

@Injectable()
export class BusinessService {
  constructor(private readonly businessRepository: BusinessRepository) {}

  async getBusiness(businessId: string) {
    const business = await this.businessRepository.findById(businessId);

    if (!business) {
      throw new NotFoundException("Negocio no encontrado.");
    }

    return business;
  }

  async updateBusiness(businessId: string, dto: UpdateBusinessDto) {
    const business = await this.businessRepository.findById(businessId);

    if (!business) {
      throw new NotFoundException("Negocio no encontrado.");
    }

    return this.businessRepository.update(businessId, dto);
  }

  async getSettings(businessId: string) {
    const settings = await this.businessRepository.findSettingsByBusinessId(businessId);

    if (!settings) {
      throw new NotFoundException("Configuración del negocio no encontrada.");
    }

    return settings;
  }

  async updateSettings(businessId: string, dto: UpdateBusinessSettingsDto) {
    const settings = await this.businessRepository.findSettingsByBusinessId(businessId);

    if (!settings) {
      throw new NotFoundException("Configuración del negocio no encontrada.");
    }

    return this.businessRepository.updateSettings(businessId, dto);
  }
}
