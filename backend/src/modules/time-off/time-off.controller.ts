import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CurrentUser, AuthUser } from "../../common/decorators/current-user.decorator";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { CreateTimeOffDto } from "./dto/create-time-off.dto";
import { TimeOffResponse } from "./entities/time-off-response.entity";
import { TimeOffService } from "./time-off.service";

@ApiTags("Time Off")
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller("time-off")
export class TimeOffController {
  constructor(private readonly timeOffService: TimeOffService) {}

  @Get()
  @ApiOperation({ summary: "Listar permisos del negocio actual" })
  @ApiOkResponse({ type: [TimeOffResponse], description: "Lista de permisos." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  getAll(@CurrentUser() user: AuthUser) {
    return this.timeOffService.getAll(user.businessId);
  }

  @Post()
  @ApiOperation({ summary: "Crear un nuevo permiso" })
  @ApiOkResponse({ type: TimeOffResponse, description: "Permiso creado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiBadRequestResponse({ description: "Datos inválidos." })
  create(@Body() dto: CreateTimeOffDto) {
    return this.timeOffService.create(dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Eliminar un permiso" })
  @ApiOkResponse({ type: TimeOffResponse, description: "Permiso eliminado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiNotFoundResponse({ description: "Permiso no encontrado." })
  remove(@Param("id") id: string) {
    return this.timeOffService.remove(id);
  }
}
