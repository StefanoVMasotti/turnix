import { Body, Controller, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CurrentBusinessId } from "../../common/decorators/current-business.decorator";
import { BusinessContextGuard } from "../../common/guards/business-context.guard";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { ClientResponse } from "./entities/client-response.entity";
import { ClientsService } from "./clients.service";

@ApiTags("Clients")
@ApiHeader({
  name: "x-business-id",
  description: "UUID del negocio actual",
  required: true
})
@UseGuards(BusinessContextGuard)
@Controller("clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: "Listar clientes del negocio actual" })
  @ApiOkResponse({ type: [ClientResponse], description: "Lista de clientes." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  getAll(@CurrentBusinessId() businessId: string) {
    return this.clientsService.getAll(businessId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un cliente por ID" })
  @ApiOkResponse({ type: ClientResponse, description: "Cliente encontrado." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  @ApiNotFoundResponse({ description: "Cliente no encontrado." })
  getById(@Param("id") id: string) {
    return this.clientsService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: "Crear un nuevo cliente" })
  @ApiOkResponse({ type: ClientResponse, description: "Cliente creado." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  @ApiBadRequestResponse({ description: "Datos inválidos." })
  create(
    @CurrentBusinessId() businessId: string,
    @Body() dto: CreateClientDto
  ) {
    return this.clientsService.create(businessId, dto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Actualizar un cliente existente" })
  @ApiOkResponse({ type: ClientResponse, description: "Cliente actualizado." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  @ApiBadRequestResponse({ description: "Datos inválidos." })
  @ApiNotFoundResponse({ description: "Cliente no encontrado." })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateClientDto
  ) {
    return this.clientsService.update(id, dto);
  }
}
