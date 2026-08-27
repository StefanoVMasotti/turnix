import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

export class CreateUserDto {
  @ApiProperty({
    description: "UUID del usuario en Supabase Auth",
    example: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"
  })
  @IsString()
  authUserId!: string;

  @ApiProperty({
    description: "Nombre del usuario",
    example: "Juan Pérez"
  })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({
    description: "Email del usuario",
    example: "juan@turnix.com"
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: "Rol del usuario",
    enum: UserRole,
    example: UserRole.admin
  })
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiProperty({
    description: "UUID del negocio",
    example: "11111111-1111-4111-8111-111111111111"
  })
  @IsString()
  businessId!: string;
}
