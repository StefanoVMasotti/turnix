import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CurrentUser, AuthUser } from "../../common/decorators/current-user.decorator";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { AppointmentResponse } from "./entities/appointment-response.entity";
import { AppointmentsService } from "./appointments.service";

@ApiTags("Appointments")
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller("appointments")
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @ApiOperation({ summary: "Listar turnos del negocio actual" })
  @ApiOkResponse({ type: [AppointmentResponse], description: "Lista de turnos." })
  @ApiQuery({ name: "clientId", required: false, description: "Filtrar por ID de cliente" })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  getAll(
    @CurrentUser() user: AuthUser,
    @Query("clientId") clientId?: string
  ) {
    return this.appointmentsService.getAll(user.businessId, clientId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un turno por ID" })
  @ApiOkResponse({ type: AppointmentResponse, description: "Turno encontrado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiNotFoundResponse({ description: "Turno no encontrado." })
  getById(@Param("id") id: string) {
    return this.appointmentsService.getById(id);
  }

  @Post()
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
  @ApiOperation({ summary: "Eliminar un turno" })
  @ApiOkResponse({ description: "Turno eliminado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiNotFoundResponse({ description: "Turno no encontrado." })
  remove(@Param("id") id: string) {
    return this.appointmentsService.remove(id);
  }
}
