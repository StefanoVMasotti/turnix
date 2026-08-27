import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CurrentUser, AuthUser } from "../../common/decorators/current-user.decorator";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { BusinessService } from "./business.service";
import { UpdateBusinessDto } from "./dto/update-business.dto";
import { UpdateBusinessSettingsDto } from "./dto/update-business-settings.dto";
import { BusinessResponse } from "./entities/business-response.entity";
import { BusinessSettingsResponse } from "./entities/business-settings-response.entity";

@ApiTags("Business")
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller("business")
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get()
  @ApiOperation({ summary: "Obtener datos del negocio actual" })
  @ApiOkResponse({ type: BusinessResponse, description: "Datos del negocio." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiBadRequestResponse({ description: "Negocio no encontrado." })
  getBusiness(@CurrentUser() user: AuthUser): Promise<BusinessResponse> {
    return this.businessService.getBusiness(user.businessId);
  }

  @Put()
  @ApiOperation({ summary: "Actualizar datos del negocio actual" })
  @ApiOkResponse({ type: BusinessResponse, description: "Negocio actualizado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiBadRequestResponse({ description: "Negocio no encontrado o datos inválidos." })
  updateBusiness(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateBusinessDto
  ): Promise<BusinessResponse> {
    return this.businessService.updateBusiness(user.businessId, dto);
  }

  @Get("settings")
  @ApiOperation({ summary: "Obtener configuración del negocio actual" })
  @ApiOkResponse({ type: BusinessSettingsResponse, description: "Configuración del negocio." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiBadRequestResponse({ description: "Configuración no encontrada." })
  getSettings(@CurrentUser() user: AuthUser): Promise<BusinessSettingsResponse> {
    return this.businessService.getSettings(user.businessId);
  }

  @Put("settings")
  @ApiOperation({ summary: "Actualizar configuración del negocio actual" })
  @ApiOkResponse({ type: BusinessSettingsResponse, description: "Configuración actualizada." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiBadRequestResponse({ description: "Configuración no encontrada o datos inválidos." })
  updateSettings(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateBusinessSettingsDto
  ): Promise<BusinessSettingsResponse> {
    return this.businessService.updateSettings(user.businessId, dto);
  }
}
