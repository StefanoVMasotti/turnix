import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CurrentBusinessId } from "../../common/decorators/current-business.decorator";
import { BusinessContextGuard } from "../../common/guards/business-context.guard";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { AppointmentResponse } from "./entities/appointment-response.entity";
import { AppointmentsService } from "./appointments.service";

@ApiTags("Appointments")
@ApiHeader({
  name: "x-business-id",
  description: "UUID del negocio actual",
  required: true
})
@UseGuards(BusinessContextGuard)
@Controller("appointments")
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @ApiOperation({ summary: "Listar turnos del negocio actual" })
  @ApiOkResponse({ type: [AppointmentResponse], description: "Lista de turnos." })
  @ApiQuery({ name: "clientId", required: false, description: "Filtrar por ID de cliente" })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  getAll(
    @CurrentBusinessId() businessId: string,
    @Query("clientId") clientId?: string
  ) {
    return this.appointmentsService.getAll(businessId, clientId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un turno por ID" })
  @ApiOkResponse({ type: AppointmentResponse, description: "Turno encontrado." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  @ApiNotFoundResponse({ description: "Turno no encontrado." })
  getById(@Param("id") id: string) {
    return this.appointmentsService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: "Crear un nuevo turno" })
  @ApiOkResponse({ type: AppointmentResponse, description: "Turno creado." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  @ApiBadRequestResponse({ description: "Datos inválidos." })
  create(
    @CurrentBusinessId() businessId: string,
    @Body() dto: CreateAppointmentDto
  ) {
    return this.appointmentsService.create(businessId, dto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Actualizar un turno existente" })
  @ApiOkResponse({ type: AppointmentResponse, description: "Turno actualizado." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
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
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  @ApiNotFoundResponse({ description: "Turno no encontrado." })
  remove(@Param("id") id: string) {
    return this.appointmentsService.remove(id);
  }
}
