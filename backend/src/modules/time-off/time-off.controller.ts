import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CurrentBusinessId } from "../../common/decorators/current-business.decorator";
import { BusinessContextGuard } from "../../common/guards/business-context.guard";
import { CreateTimeOffDto } from "./dto/create-time-off.dto";
import { TimeOffResponse } from "./entities/time-off-response.entity";
import { TimeOffService } from "./time-off.service";

@ApiTags("Time Off")
@ApiHeader({
  name: "x-business-id",
  description: "UUID del negocio actual",
  required: true
})
@UseGuards(BusinessContextGuard)
@Controller("time-off")
export class TimeOffController {
  constructor(private readonly timeOffService: TimeOffService) {}

  @Get()
  @ApiOperation({ summary: "Listar permisos del negocio actual" })
  @ApiOkResponse({ type: [TimeOffResponse], description: "Lista de permisos." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  getAll(@CurrentBusinessId() businessId: string) {
    return this.timeOffService.getAll(businessId);
  }

  @Post()
  @ApiOperation({ summary: "Crear un nuevo permiso" })
  @ApiOkResponse({ type: TimeOffResponse, description: "Permiso creado." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  @ApiBadRequestResponse({ description: "Datos inválidos." })
  create(@Body() dto: CreateTimeOffDto) {
    return this.timeOffService.create(dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Eliminar un permiso" })
  @ApiOkResponse({ type: TimeOffResponse, description: "Permiso eliminado." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  @ApiNotFoundResponse({ description: "Permiso no encontrado." })
  remove(@Param("id") id: string) {
    return this.timeOffService.remove(id);
  }
}
