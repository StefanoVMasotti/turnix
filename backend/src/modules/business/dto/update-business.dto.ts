import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";
import { IsNormalizedOptionalPhone } from "../../../common/decorators/phone.decorator";

export class UpdateBusinessDto {
  @ApiPropertyOptional({ example: "Turnix Barbería", maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: "turnix-barberia", maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  slug?: string;

  @ApiPropertyOptional({ example: "541155555555", maxLength: 15 })
  @IsOptional()
  @IsString()
  @IsNormalizedOptionalPhone()
  phone?: string | null;

  @ApiPropertyOptional({ example: "info@turnix.app", maxLength: 255 })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ example: "Av. Corrientes 1234", maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;
}
