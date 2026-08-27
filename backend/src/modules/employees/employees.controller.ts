import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CurrentUser, AuthUser } from "../../common/decorators/current-user.decorator";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { EmployeeResponse } from "./entities/employee-response.entity";
import { EmployeesService } from "./employees.service";

@ApiTags("Employees")
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller("employees")
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  @ApiOperation({ summary: "Listar empleados del negocio actual" })
  @ApiOkResponse({ type: [EmployeeResponse], description: "Lista de empleados." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  getAll(@CurrentUser() user: AuthUser) {
    return this.employeesService.getAll(user.businessId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un empleado por ID" })
  @ApiOkResponse({ type: EmployeeResponse, description: "Empleado encontrado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiNotFoundResponse({ description: "Empleado no encontrado." })
  getById(@Param("id") id: string) {
    return this.employeesService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: "Crear un nuevo empleado" })
  @ApiOkResponse({ type: EmployeeResponse, description: "Empleado creado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiBadRequestResponse({ description: "Datos inválidos." })
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateEmployeeDto
  ) {
    return this.employeesService.create(user.businessId, dto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Actualizar un empleado existente" })
  @ApiOkResponse({ type: EmployeeResponse, description: "Empleado actualizado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiBadRequestResponse({ description: "Datos inválidos." })
  @ApiNotFoundResponse({ description: "Empleado no encontrado." })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateEmployeeDto
  ) {
    return this.employeesService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Desactivar un empleado (soft delete)" })
  @ApiOkResponse({ type: EmployeeResponse, description: "Empleado desactivado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiNotFoundResponse({ description: "Empleado no encontrado." })
  remove(@Param("id") id: string) {
    return this.employeesService.remove(id);
  }

  @Patch(":id/toggle-active")
  @ApiOperation({ summary: "Activar o desactivar un empleado" })
  @ApiOkResponse({ type: EmployeeResponse, description: "Estado del empleado actualizado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiNotFoundResponse({ description: "Empleado no encontrado." })
  toggleActive(@Param("id") id: string) {
    return this.employeesService.toggleActive(id);
  }
}
