import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsOptional, IsString, MaxLength } from "class-validator";
import { IsNormalizedOptionalPhone } from "../../../common/decorators/phone.decorator";

export class UpdateEmployeeDto {
  @ApiPropertyOptional({ example: "Alex", maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({ example: "Ruiz", maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional({ example: "541155551111", maxLength: 15 })
  @IsOptional()
  @IsString()
  @IsNormalizedOptionalPhone()
  phone?: string | null;

  @ApiPropertyOptional({ example: "alex@turnix.app", maxLength: 255 })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
