import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiConflictResponse, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CurrentBusinessId } from "../../common/decorators/current-business.decorator";
import { BusinessContextGuard } from "../../common/guards/business-context.guard";
import { CreateEmployeeServiceDto } from "./dto/create-employee-service.dto";
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

  @Delete(":id")
  @ApiOperation({ summary: "Remover asignación de servicio a empleado" })
  @ApiOkResponse({ type: EmployeeServiceResponse, description: "Asignación removida." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  @ApiNotFoundResponse({ description: "Relación empleado-servicio no encontrada." })
  remove(@Param("id") id: string) {
    return this.employeeServicesService.remove(id);
  }
}
