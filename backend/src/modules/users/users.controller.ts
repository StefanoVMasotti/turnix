import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CurrentUser, AuthUser } from "../../common/decorators/current-user.decorator";
import { JwtGuard } from "../../common/guards/jwt.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { UserRole } from "@prisma/client";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.owner)
  @ApiOperation({ summary: "Listar usuarios del negocio" })
  @ApiOkResponse({ description: "Lista de usuarios." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  getAll(@CurrentUser() user: AuthUser) {
    return this.usersService.getAll(user.businessId);
  }

  @Get(":id")
  @Roles(UserRole.owner)
  @ApiOperation({ summary: "Obtener un usuario por ID" })
  @ApiOkResponse({ description: "Usuario encontrado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiNotFoundResponse({ description: "Usuario no encontrado." })
  getById(@Param("id") id: string) {
    return this.usersService.getById(id);
  }

  @Post()
  @Roles(UserRole.owner)
  @ApiOperation({ summary: "Crear un nuevo usuario" })
  @ApiOkResponse({ description: "Usuario creado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiBadRequestResponse({ description: "Datos inválidos." })
  @ApiConflictResponse({ description: "El usuario ya existe." })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Delete(":id")
  @Roles(UserRole.owner)
  @ApiOperation({ summary: "Desactivar un usuario" })
  @ApiOkResponse({ description: "Usuario desactivado." })
  @ApiUnauthorizedResponse({ description: "Token requerido." })
  @ApiNotFoundResponse({ description: "Usuario no encontrado." })
  remove(@Param("id") id: string) {
    return this.usersService.softDelete(id);
  }
}
