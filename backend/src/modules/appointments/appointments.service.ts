import { Injectable, NotFoundException } from "@nestjs/common";
import { AppointmentsRepository } from "./appointments.repository";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";

@Injectable()
export class AppointmentsService {
  constructor(private readonly appointmentsRepository: AppointmentsRepository) {}

  async getAll(
    businessId: string,
    clientId?: string,
    page = 1,
    limit = 20,
    filters?: { status?: string; dateFrom?: string; dateTo?: string }
  ) {
    const [data, total] = await this.appointmentsRepository.findAllByBusinessId(
      businessId, clientId, page, limit, filters
    );
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  async getById(id: string) {
    const appointment = await this.appointmentsRepository.findById(id);

    if (!appointment) {
      throw new NotFoundException("Turno no encontrado.");
    }

    return appointment;
  }

  async create(businessId: string, dto: CreateAppointmentDto) {
    return this.appointmentsRepository.create(businessId, dto);
  }

  async update(id: string, dto: UpdateAppointmentDto) {
    const appointment = await this.appointmentsRepository.findById(id);

    if (!appointment) {
      throw new NotFoundException("Turno no encontrado.");
    }

    return this.appointmentsRepository.update(id, dto);
  }

  async remove(id: string) {
    const appointment = await this.appointmentsRepository.findById(id);

    if (!appointment) {
      throw new NotFoundException("Turno no encontrado.");
    }

    return this.appointmentsRepository.delete(id);
  }
}
