import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import DOMPurify from "isomorphic-dompurify";

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

  @ApiPropertyOptional({ example: "Cliente frecuente", maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value ? DOMPurify.sanitize(value) : value)
  notes?: string;
}
