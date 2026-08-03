import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CurrentBusinessId } from "../../common/decorators/current-business.decorator";
import { BusinessContextGuard } from "../../common/guards/business-context.guard";
import { CreateBlockDto } from "./dto/create-block.dto";
import { BlockResponse } from "./entities/block-response.entity";
import { BlocksService } from "./blocks.service";

@ApiTags("Blocks")
@ApiHeader({
  name: "x-business-id",
  description: "UUID del negocio actual",
  required: true
})
@UseGuards(BusinessContextGuard)
@Controller("blocks")
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Get()
  @ApiOperation({ summary: "Listar bloqueos del negocio actual" })
  @ApiOkResponse({ type: [BlockResponse], description: "Lista de bloqueos." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  getAll(@CurrentBusinessId() businessId: string) {
    return this.blocksService.getAll(businessId);
  }

  @Post()
  @ApiOperation({ summary: "Crear un nuevo bloqueo" })
  @ApiOkResponse({ type: BlockResponse, description: "Bloqueo creado." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  @ApiBadRequestResponse({ description: "Datos inválidos." })
  create(@Body() dto: CreateBlockDto) {
    return this.blocksService.create(dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Eliminar un bloqueo" })
  @ApiOkResponse({ type: BlockResponse, description: "Bloqueo eliminado." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  @ApiNotFoundResponse({ description: "Bloqueo no encontrado." })
  remove(@Param("id") id: string) {
    return this.blocksService.remove(id);
  }
}
