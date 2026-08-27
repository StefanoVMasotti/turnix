import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CurrentUser, AuthUser } from "../../common/decorators/current-user.decorator";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";
import { ScheduleResponse } from "./entities/schedule-response.entity";
import { SchedulesService } from "./schedules.service";

@ApiTags("Schedules")
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller("schedules")
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Get()
  @ApiOperation({ summary: "Listar horarios del negocio actual" })
  @ApiOkResponse({ type: [ScheduleResponse], description: "Lista de horarios." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  getAll(@CurrentUser() user: AuthUser) {
    return this.schedulesService.getAll(user.businessId);
  }

  @Post()
  @ApiOperation({ summary: "Crear un nuevo horario" })
  @ApiOkResponse({ type: ScheduleResponse, description: "Horario creado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiBadRequestResponse({ description: "Datos inválidos." })
  create(@Body() dto: CreateScheduleDto) {
    return this.schedulesService.create(dto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Actualizar un horario existente" })
  @ApiOkResponse({ type: ScheduleResponse, description: "Horario actualizado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiBadRequestResponse({ description: "Datos inválidos." })
  @ApiNotFoundResponse({ description: "Horario no encontrado." })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateScheduleDto
  ) {
    return this.schedulesService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Eliminar un horario" })
  @ApiOkResponse({ type: ScheduleResponse, description: "Horario eliminado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiNotFoundResponse({ description: "Horario no encontrado." })
  remove(@Param("id") id: string) {
    return this.schedulesService.remove(id);
  }
}
