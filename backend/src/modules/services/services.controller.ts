import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CurrentUser, AuthUser } from "../../common/decorators/current-user.decorator";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { ServiceResponse } from "./entities/service-response.entity";
import { ServicesService } from "./services.service";

@ApiTags("Services")
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller("services")
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: "Listar servicios del negocio actual" })
  @ApiOkResponse({ type: [ServiceResponse], description: "Lista de servicios." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  getAll(@CurrentUser() user: AuthUser) {
    return this.servicesService.getAll(user.businessId);
  }

  @Post()
  @ApiOperation({ summary: "Crear un nuevo servicio" })
  @ApiOkResponse({ type: ServiceResponse, description: "Servicio creado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiBadRequestResponse({ description: "Datos inválidos." })
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateServiceDto
  ) {
    return this.servicesService.create(user.businessId, dto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Actualizar un servicio existente" })
  @ApiOkResponse({ type: ServiceResponse, description: "Servicio actualizado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiBadRequestResponse({ description: "Datos inválidos." })
  @ApiNotFoundResponse({ description: "Servicio no encontrado." })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateServiceDto
  ) {
    return this.servicesService.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Desactivar un servicio (soft delete)" })
  @ApiOkResponse({ type: ServiceResponse, description: "Servicio desactivado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiNotFoundResponse({ description: "Servicio no encontrado." })
  remove(@Param("id") id: string) {
    return this.servicesService.remove(id);
  }

  @Patch(":id/toggle-active")
  @ApiOperation({ summary: "Activar o desactivar un servicio" })
  @ApiOkResponse({ type: ServiceResponse, description: "Estado del servicio actualizado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiNotFoundResponse({ description: "Servicio no encontrado." })
  toggleActive(@Param("id") id: string) {
    return this.servicesService.toggleActive(id);
  }
}
