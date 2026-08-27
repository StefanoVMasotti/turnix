import { Body, Controller, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CurrentUser, AuthUser } from "../../common/decorators/current-user.decorator";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { ClientResponse } from "./entities/client-response.entity";
import { ClientsService } from "./clients.service";

@ApiTags("Clients")
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller("clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: "Listar clientes del negocio actual" })
  @ApiOkResponse({ type: [ClientResponse], description: "Lista de clientes." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  getAll(@CurrentUser() user: AuthUser) {
    return this.clientsService.getAll(user.businessId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Obtener un cliente por ID" })
  @ApiOkResponse({ type: ClientResponse, description: "Cliente encontrado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiNotFoundResponse({ description: "Cliente no encontrado." })
  getById(@Param("id") id: string) {
    return this.clientsService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: "Crear un nuevo cliente" })
  @ApiOkResponse({ type: ClientResponse, description: "Cliente creado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiBadRequestResponse({ description: "Datos inválidos." })
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateClientDto
  ) {
    return this.clientsService.create(user.businessId, dto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Actualizar un cliente existente" })
  @ApiOkResponse({ type: ClientResponse, description: "Cliente actualizado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiBadRequestResponse({ description: "Datos inválidos." })
  @ApiNotFoundResponse({ description: "Cliente no encontrado." })
  update(
    @Param("id") id: string,
    @Body() dto: UpdateClientDto
  ) {
    return this.clientsService.update(id, dto);
  }
}
