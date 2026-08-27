import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CurrentUser, AuthUser } from "../../common/decorators/current-user.decorator";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { CreateBlockDto } from "./dto/create-block.dto";
import { BlockResponse } from "./entities/block-response.entity";
import { BlocksService } from "./blocks.service";

@ApiTags("Blocks")
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller("blocks")
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Get()
  @ApiOperation({ summary: "Listar bloqueos del negocio actual" })
  @ApiOkResponse({ type: [BlockResponse], description: "Lista de bloqueos." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  getAll(@CurrentUser() user: AuthUser) {
    return this.blocksService.getAll(user.businessId);
  }

  @Post()
  @ApiOperation({ summary: "Crear un nuevo bloqueo" })
  @ApiOkResponse({ type: BlockResponse, description: "Bloqueo creado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiBadRequestResponse({ description: "Datos inválidos." })
  create(@Body() dto: CreateBlockDto) {
    return this.blocksService.create(dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Eliminar un bloqueo" })
  @ApiOkResponse({ type: BlockResponse, description: "Bloqueo eliminado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiNotFoundResponse({ description: "Bloqueo no encontrado." })
  remove(@Param("id") id: string) {
    return this.blocksService.remove(id);
  }
}
