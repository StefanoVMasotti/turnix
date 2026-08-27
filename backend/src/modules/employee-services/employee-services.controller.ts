import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CurrentUser, AuthUser } from "../../common/decorators/current-user.decorator";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { CreateEmployeeServiceDto } from "./dto/create-employee-service.dto";
import { UpdateEmployeeServiceDto } from "./dto/update-employee-service.dto";
import { EmployeeServiceResponse } from "./entities/employee-service-response.entity";
import { EmployeeServicesService } from "./employee-services.service";

@ApiTags("Employee Services")
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller("employee-services")
export class EmployeeServicesController {
  constructor(private readonly employeeServicesService: EmployeeServicesService) {}

  @Get()
  @ApiOperation({ summary: "Listar asignaciones empleado-servicio del negocio" })
  @ApiOkResponse({ type: [EmployeeServiceResponse], description: "Lista de asignaciones." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  getAll(@CurrentUser() user: AuthUser) {
    return this.employeeServicesService.getAll(user.businessId);
  }

  @Post()
  @ApiOperation({ summary: "Asignar un servicio a un empleado" })
  @ApiOkResponse({ type: EmployeeServiceResponse, description: "Asignación creada." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
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
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  update(@Param("id") id: string, @Body() dto: UpdateEmployeeServiceDto) {
    return this.employeeServicesService.update(id, dto);
  }

  @Patch(":id/toggle-active")
  @ApiOperation({ summary: "Activar o desactivar una asignación" })
  @ApiOkResponse({ type: EmployeeServiceResponse, description: "Estado actualizado." })
  @ApiNotFoundResponse({ description: "Relación empleado-servicio no encontrada." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  toggleActive(@Param("id") id: string) {
    return this.employeeServicesService.toggleActive(id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Desactivar una asignación (soft delete)" })
  @ApiOkResponse({ type: EmployeeServiceResponse, description: "Asignación desactivada." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiNotFoundResponse({ description: "Relación empleado-servicio no encontrada." })
  remove(@Param("id") id: string) {
    return this.employeeServicesService.remove(id);
  }
}
