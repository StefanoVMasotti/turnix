import { Injectable, NotFoundException } from "@nestjs/common";
import { ServicesRepository } from "./services.repository";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";

@Injectable()
export class ServicesService {
  constructor(private readonly servicesRepository: ServicesRepository) {}

  async getAll(businessId: string) {
    return this.servicesRepository.findAllByBusinessId(businessId);
  }

  async getById(id: string) {
    const service = await this.servicesRepository.findById(id);

    if (!service) {
      throw new NotFoundException("Servicio no encontrado.");
    }

    return service;
  }

  async create(businessId: string, dto: CreateServiceDto) {
    return this.servicesRepository.create(businessId, dto);
  }

  async update(id: string, dto: UpdateServiceDto) {
    const service = await this.servicesRepository.findById(id);

    if (!service) {
      throw new NotFoundException("Servicio no encontrado.");
    }

    return this.servicesRepository.update(id, dto);
  }

  async remove(id: string) {
    const service = await this.servicesRepository.findById(id);

    if (!service) {
      throw new NotFoundException("Servicio no encontrado.");
    }

    return this.servicesRepository.softDelete(id);
  }

  async toggleActive(id: string) {
    const service = await this.servicesRepository.findById(id);

    if (!service) {
      throw new NotFoundException("Servicio no encontrado.");
    }

    return this.servicesRepository.toggleActive(id);
  }
}
