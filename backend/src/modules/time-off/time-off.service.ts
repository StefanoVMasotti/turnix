import { Injectable, NotFoundException } from "@nestjs/common";
import { TimeOffRepository } from "./time-off.repository";
import { CreateTimeOffDto } from "./dto/create-time-off.dto";

@Injectable()
export class TimeOffService {
  constructor(private readonly timeOffRepository: TimeOffRepository) {}

  async getAll(businessId: string) {
    return this.timeOffRepository.findAllByBusinessId(businessId);
  }

  async getById(id: string) {
    const timeOff = await this.timeOffRepository.findById(id);

    if (!timeOff) {
      throw new NotFoundException("Permisos no encontrado.");
    }

    return timeOff;
  }

  async create(dto: CreateTimeOffDto) {
    return this.timeOffRepository.create(dto);
  }

  async remove(id: string) {
    const timeOff = await this.timeOffRepository.findById(id);

    if (!timeOff) {
      throw new NotFoundException("Permisos no encontrado.");
    }

    return this.timeOffRepository.delete(id);
  }
}
