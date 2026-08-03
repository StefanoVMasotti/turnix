import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CurrentBusinessId } from "../../common/decorators/current-business.decorator";
import { BusinessContextGuard } from "../../common/guards/business-context.guard";
import { CreateServiceDto } from "./dto/create-service.dto";
import { UpdateServiceDto } from "./dto/update-service.dto";
import { ServiceResponse } from "./entities/service-response.entity";
import { ServicesService } from "./services.service";

@ApiTags("Services")
@ApiHeader({
  name: "x-business-id",
  description: "UUID del negocio actual",
  required: true
})
@UseGuards(BusinessContextGuard)
@Controller("services")
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: "Listar servicios del negocio actual" })
  @ApiOkResponse({ type: [ServiceResponse], description: "Lista de servicios." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  getAll(@CurrentBusinessId() businessId: string) {
    return this.servicesService.getAll(businessId);
  }

  @Post()
  @ApiOperation({ summary: "Crear un nuevo servicio" })
  @ApiOkResponse({ type: ServiceResponse, description: "Servicio creado." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  @ApiBadRequestResponse({ description: "Datos inválidos." })
  create(
    @CurrentBusinessId() businessId: string,
    @Body() dto: CreateServiceDto
  ) {
    return this.servicesService.create(businessId, dto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Actualizar un servicio existente" })
  @ApiOkResponse({ type: ServiceResponse, description: "Servicio actualizado." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
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
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  @ApiNotFoundResponse({ description: "Servicio no encontrado." })
  remove(@Param("id") id: string) {
    return this.servicesService.remove(id);
  }

  @Patch(":id/toggle-active")
  @ApiOperation({ summary: "Activar o desactivar un servicio" })
  @ApiOkResponse({ type: ServiceResponse, description: "Estado del servicio actualizado." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  @ApiNotFoundResponse({ description: "Servicio no encontrado." })
  toggleActive(@Param("id") id: string) {
    return this.servicesService.toggleActive(id);
  }
}
