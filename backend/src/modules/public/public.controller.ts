import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags
} from "@nestjs/swagger";
import { PublicService } from "./public.service";
import { CreatePublicAppointmentDto } from "./dto/create-public-appointment.dto";
import { PublicLandingResponse } from "./entities/public-landing.entity";

@ApiTags("Public")
@Controller("public")
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get(":slug")
  @ApiOperation({ summary: "Datos de la landing pública de un negocio por slug" })
  @ApiOkResponse({ type: PublicLandingResponse, description: "Datos de la landing." })
  @ApiNotFoundResponse({ description: "Negocio no encontrado." })
  getLanding(@Param("slug") slug: string) {
    return this.publicService.getLanding(slug);
  }

  @Get(":slug/availability")
  @ApiOperation({
    summary: "Disponibilidad de un servicio",
    description:
      "Sin ?date devuelve los días del booking window con cantidad de turnos libres. Con ?date=YYYY-MM-DD devuelve los horarios disponibles de ese día."
  })
  @ApiQuery({ name: "serviceId", required: true, description: "UUID del servicio" })
  @ApiQuery({ name: "employeeId", required: false, description: "UUID del profesional (opcional)" })
  @ApiQuery({ name: "date", required: false, description: "Fecha YYYY-MM-DD (opcional)" })
  @ApiOkResponse({ description: "Días disponibles o slots del día." })
  @ApiBadRequestResponse({ description: "Servicio no válido o fecha fuera de rango." })
  getAvailability(
    @Param("slug") slug: string,
    @Query("serviceId") serviceId: string,
    @Query("employeeId") employeeId?: string,
    @Query("date") date?: string
  ) {
    return this.publicService.getAvailability(slug, serviceId, employeeId, date);
  }

  @Post(":slug/appointments")
  @ApiOperation({ summary: "Crear un turno desde la reserva pública" })
  @ApiCreatedResponse({ description: "Turno creado." })
  @ApiBadRequestResponse({ description: "Datos inválidos o servicio no disponible." })
  @ApiConflictResponse({ description: "El horario seleccionado ya no está disponible." })
  @ApiNotFoundResponse({ description: "Negocio no encontrado." })
  create(@Param("slug") slug: string, @Body() dto: CreatePublicAppointmentDto) {
    return this.publicService.createAppointment(slug, dto);
  }
}
