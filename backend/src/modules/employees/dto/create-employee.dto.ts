import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

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

  @ApiPropertyOptional({ example: "+54 11 5555-1111", maxLength: 30 })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ example: "alex@turnix.app", maxLength: 255 })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;
}
