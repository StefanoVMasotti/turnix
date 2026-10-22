import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { IsNormalizedOptionalPhone } from "../../../common/decorators/phone.decorator";

export class CreateEmployeeDto {
  @ApiProperty({ example: "Alex", maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  firstName!: string;

  @ApiProperty({ example: "Ruiz", maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  lastName!: string;

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
}
