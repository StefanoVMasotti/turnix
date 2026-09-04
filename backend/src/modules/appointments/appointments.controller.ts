import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, DefaultValuePipe, ParseIntPipe, BadRequestException } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CurrentUser, AuthUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { AppointmentResponse, PaginatedAppointmentsResponse } from "./entities/appointment-response.entity";
import { AppointmentsService } from "./appointments.service";

@ApiTags("Appointments")
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Controller("appointments")
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @Roles("owner", "admin")
  @ApiOperation({ summary: "Listar turnos del negocio actual (paginado)" })
  @ApiOkResponse({ type: PaginatedAppointmentsResponse, description: "Lista paginada de turnos." })
  @ApiQuery({ name: "page", required: false, example: 1 })
  @ApiQuery({ name: "limit", required: false, example: 20 })
  @ApiQuery({ name: "clientId", required: false, description: "Filtrar por ID de cliente" })
  @ApiQuery({ name: "status", required: false, enum: ["scheduled", "completed", "cancelled", "no_show"] })
  @ApiQuery({ name: "dateFrom", required: false, example: "2026-09-01" })
  @ApiQuery({ name: "dateTo", required: false, example: "2026-09-30" })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  async getAll(
    @CurrentUser() user: AuthUser,
    @Query("clientId") clientId?: string,
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit = 20,
    @Query("status") status?: string,
    @Query("dateFrom") dateFrom?: string,
    @Query("dateTo") dateTo?: string
  ) {
    if (limit > 100) {
      throw new BadRequestException("El límite máximo es 100.");
    }
    
    return this.appointmentsService.getAll(
      user.businessId, clientId, page, limit,
      { status, dateFrom, dateTo }
    );
  }

  @Get(":id")
  @Roles("owner", "admin")
  @ApiOperation({ summary: "Obtener un turno por ID" })
  @ApiOkResponse({ type: AppointmentResponse, description: "Turno encontrado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiNotFoundResponse({ description: "Turno no encontrado." })
  getById(@Param("id") id: string) {
    return this.appointmentsService.getById(id);
  }

  @Post()
  @Roles("owner", "admin")
  @ApiOperation({ summary: "Crear un nuevo turno" })
  @ApiOkResponse({ type: AppointmentResponse, description: "Turno creado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiBadRequestResponse({ description: "Datos inválidos." })
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateAppointmentDto
  ) {
    return this.appointmentsService.create(user.businessId, dto);
  }

  @Put(":id")
  @Roles("owner", "admin")
  @ApiOperation({ summary: "Actualizar un turno existente" })
  @ApiOkResponse({ type: AppointmentResponse, description: "Turno actualizado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiBadRequestResponse({ description: "Datos inválidos." })
  @ApiNotFoundResponse({ description: "Turno no encontrado." })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateAppointmentDto
  ) {
    return this.appointmentsService.update(id, dto);
  }

  @Delete(":id")
  @Roles("owner", "admin")
  @ApiOperation({ summary: "Eliminar un turno" })
  @ApiOkResponse({ description: "Turno eliminado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiNotFoundResponse({ description: "Turno no encontrado." })
  remove(@Param("id") id: string) {
    return this.appointmentsService.remove(id);
  }
}
