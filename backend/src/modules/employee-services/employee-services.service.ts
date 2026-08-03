import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { EmployeeServicesRepository } from "./employee-services.repository";
import { CreateEmployeeServiceDto } from "./dto/create-employee-service.dto";

@Injectable()
export class EmployeeServicesService {
  constructor(private readonly employeeServicesRepository: EmployeeServicesRepository) {}

  async getAll(businessId: string) {
    return this.employeeServicesRepository.findAllByBusinessId(businessId);
  }

  async create(dto: CreateEmployeeServiceDto) {
    const existing = await this.employeeServicesRepository.findByEmployeeAndService(
      dto.employeeId,
      dto.serviceId
    );

    if (existing) {
      if (existing.active) {
        throw new ConflictException("Este empleado ya tiene asignado este servicio.");
      }

      return this.employeeServicesRepository.create(dto);
    }

    return this.employeeServicesRepository.create(dto);
  }

  async remove(id: string) {
    const employeeService = await this.employeeServicesRepository.findById(id);

    if (!employeeService) {
      throw new NotFoundException("Relación empleado-servicio no encontrada.");
    }

    return this.employeeServicesRepository.softDelete(id);
  }
}
