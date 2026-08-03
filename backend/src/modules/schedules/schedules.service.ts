import { Injectable, NotFoundException } from "@nestjs/common";
import { SchedulesRepository } from "./schedules.repository";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";

@Injectable()
export class SchedulesService {
  constructor(private readonly schedulesRepository: SchedulesRepository) {}

  async getAll(businessId: string) {
    return this.schedulesRepository.findAllByBusinessId(businessId);
  }

  async getById(id: string) {
    const schedule = await this.schedulesRepository.findById(id);

    if (!schedule) {
      throw new NotFoundException("Horario no encontrado.");
    }

    return schedule;
  }

  async create(dto: CreateScheduleDto) {
    return this.schedulesRepository.create(dto);
  }

  async update(id: string, dto: UpdateScheduleDto) {
    const schedule = await this.schedulesRepository.findById(id);

    if (!schedule) {
      throw new NotFoundException("Horario no encontrado.");
    }

    return this.schedulesRepository.update(id, dto);
  }

  async remove(id: string) {
    const schedule = await this.schedulesRepository.findById(id);

    if (!schedule) {
      throw new NotFoundException("Horario no encontrado.");
    }

    return this.schedulesRepository.delete(id);
  }
}
