import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CurrentUser, AuthUser } from "../../common/decorators/current-user.decorator";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { LoginDto } from "./dto/login.dto";
import { AuthService, LoginResponse } from "./auth.service";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "Iniciar sesión" })
  @ApiOkResponse({ description: "Login exitoso." })
  @ApiBadRequestResponse({ description: "Credenciales inválidas." })
  login(@Body() dto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(dto);
  }

  @Post("logout")
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Cerrar sesión" })
  @ApiOkResponse({ description: "Sesión cerrada." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  logout() {
    return { message: "Sesión cerrada." };
  }

  @Get("profile")
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Obtener perfil del usuario autenticado" })
  @ApiOkResponse({ description: "Perfil del usuario." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  getProfile(@CurrentUser() user: AuthUser) {
    return this.authService.getProfile(user.id);
  }
}
