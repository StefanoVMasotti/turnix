import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiConflictResponse, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CurrentBusinessId } from "../../common/decorators/current-business.decorator";
import { BusinessContextGuard } from "../../common/guards/business-context.guard";
import { CreateEmployeeServiceDto } from "./dto/create-employee-service.dto";
import { UpdateEmployeeServiceDto } from "./dto/update-employee-service.dto";
import { EmployeeServiceResponse } from "./entities/employee-service-response.entity";
import { EmployeeServicesService } from "./employee-services.service";

@ApiTags("Employee Services")
@ApiHeader({
  name: "x-business-id",
  description: "UUID del negocio actual",
  required: true
})
@UseGuards(BusinessContextGuard)
@Controller("employee-services")
export class EmployeeServicesController {
  constructor(private readonly employeeServicesService: EmployeeServicesService) {}

  @Get()
  @ApiOperation({ summary: "Listar asignaciones empleado-servicio del negocio" })
  @ApiOkResponse({ type: [EmployeeServiceResponse], description: "Lista de asignaciones." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  getAll(@CurrentBusinessId() businessId: string) {
    return this.employeeServicesService.getAll(businessId);
  }

  @Post()
  @ApiOperation({ summary: "Asignar un servicio a un empleado" })
  @ApiOkResponse({ type: EmployeeServiceResponse, description: "Asignación creada." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  @ApiBadRequestResponse({ description: "Datos inválidos." })
  @ApiConflictResponse({ description: "El empleado ya tiene asignado este servicio." })
  create(@Body() dto: CreateEmployeeServiceDto) {
    return this.employeeServicesService.create(dto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Actualizar el precio de una asignación" })
  @ApiOkResponse({ type: EmployeeServiceResponse, description: "Asignación actualizada." })
  @ApiBadRequestResponse({ description: "Datos inválidos." })
  @ApiNotFoundResponse({ description: "Relación empleado-servicio no encontrada." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  update(@Param("id") id: string, @Body() dto: UpdateEmployeeServiceDto) {
    return this.employeeServicesService.update(id, dto);
  }

  @Patch(":id/toggle-active")
  @ApiOperation({ summary: "Activar o desactivar una asignación" })
  @ApiOkResponse({ type: EmployeeServiceResponse, description: "Estado actualizado." })
  @ApiNotFoundResponse({ description: "Relación empleado-servicio no encontrada." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  toggleActive(@Param("id") id: string) {
    return this.employeeServicesService.toggleActive(id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Desactivar una asignación (soft delete)" })
  @ApiOkResponse({ type: EmployeeServiceResponse, description: "Asignación desactivada." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  @ApiNotFoundResponse({ description: "Relación empleado-servicio no encontrada." })
  remove(@Param("id") id: string) {
    return this.employeeServicesService.remove(id);
  }
}
