import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CurrentBusinessId } from "../../common/decorators/current-business.decorator";
import { BusinessContextGuard } from "../../common/guards/business-context.guard";
import { BusinessService } from "./business.service";
import { UpdateBusinessDto } from "./dto/update-business.dto";
import { UpdateBusinessSettingsDto } from "./dto/update-business-settings.dto";
import { BusinessResponse } from "./entities/business-response.entity";
import { BusinessSettingsResponse } from "./entities/business-settings-response.entity";

@ApiTags("Business")
@ApiHeader({
  name: "x-business-id",
  description: "UUID del negocio actual",
  required: true
})
@UseGuards(BusinessContextGuard)
@Controller("business")
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get()
  @ApiOperation({ summary: "Obtener datos del negocio actual" })
  @ApiOkResponse({ type: BusinessResponse, description: "Datos del negocio." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  @ApiBadRequestResponse({ description: "Negocio no encontrado." })
  getBusiness(@CurrentBusinessId() businessId: string): Promise<BusinessResponse> {
    return this.businessService.getBusiness(businessId);
  }

  @Put()
  @ApiOperation({ summary: "Actualizar datos del negocio actual" })
  @ApiOkResponse({ type: BusinessResponse, description: "Negocio actualizado." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  @ApiBadRequestResponse({ description: "Negocio no encontrado o datos inválidos." })
  updateBusiness(
    @CurrentBusinessId() businessId: string,
    @Body() dto: UpdateBusinessDto
  ): Promise<BusinessResponse> {
    return this.businessService.updateBusiness(businessId, dto);
  }

  @Get("settings")
  @ApiOperation({ summary: "Obtener configuración del negocio actual" })
  @ApiOkResponse({ type: BusinessSettingsResponse, description: "Configuración del negocio." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  @ApiBadRequestResponse({ description: "Configuración no encontrada." })
  getSettings(@CurrentBusinessId() businessId: string): Promise<BusinessSettingsResponse> {
    return this.businessService.getSettings(businessId);
  }

  @Put("settings")
  @ApiOperation({ summary: "Actualizar configuración del negocio actual" })
  @ApiOkResponse({ type: BusinessSettingsResponse, description: "Configuración actualizada." })
  @ApiUnauthorizedResponse({ description: "Header x-business-id requerido o inválido." })
  @ApiBadRequestResponse({ description: "Configuración no encontrada o datos inválidos." })
  updateSettings(
    @CurrentBusinessId() businessId: string,
    @Body() dto: UpdateBusinessSettingsDto
  ): Promise<BusinessSettingsResponse> {
    return this.businessService.updateSettings(businessId, dto);
  }
}
