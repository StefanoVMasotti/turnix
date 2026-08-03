import { Injectable, NotFoundException } from "@nestjs/common";
import { EmployeesRepository } from "./employees.repository";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";

@Injectable()
export class EmployeesService {
  constructor(private readonly employeesRepository: EmployeesRepository) {}

  async getAll(businessId: string) {
    return this.employeesRepository.findAllByBusinessId(businessId);
  }

  async getById(id: string) {
    const employee = await this.employeesRepository.findById(id);

    if (!employee) {
      throw new NotFoundException("Empleado no encontrado.");
    }

    return employee;
  }

  async create(businessId: string, dto: CreateEmployeeDto) {
    return this.employeesRepository.create(businessId, dto);
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    const employee = await this.employeesRepository.findById(id);

    if (!employee) {
      throw new NotFoundException("Empleado no encontrado.");
    }

    return this.employeesRepository.update(id, dto);
  }

  async remove(id: string) {
    const employee = await this.employeesRepository.findById(id);

    if (!employee) {
      throw new NotFoundException("Empleado no encontrado.");
    }

    return this.employeesRepository.softDelete(id);
  }

  async toggleActive(id: string) {
    const employee = await this.employeesRepository.findById(id);

    if (!employee) {
      throw new NotFoundException("Empleado no encontrado.");
    }

    return this.employeesRepository.toggleActive(id);
  }
}
