import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateClientDto {
  @ApiProperty({ example: "Cliente", maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  firstName!: string;

  @ApiProperty({ example: "Demo", maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  lastName!: string;

  @ApiProperty({ example: "+54 11 5555-9999", maxLength: 30 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  phone!: string;

  @ApiPropertyOptional({ example: "cliente.demo@turnix.app", maxLength: 255 })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ example: "Cliente frecuente" })
  @IsOptional()
  @IsString()
  notes?: string;
}
