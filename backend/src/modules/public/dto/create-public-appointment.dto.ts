import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested
} from "class-validator";
import DOMPurify from "isomorphic-dompurify";

export class PublicClientDto {
  @ApiProperty({ example: "Juan", maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  firstName!: string;

  @ApiProperty({ example: "Pérez", maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  lastName!: string;

  @ApiProperty({ example: "+54 11 5555-1234", maxLength: 30 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  phone!: string;

  @ApiPropertyOptional({ example: "juan@mail.com", maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ example: "Cliente nuevo desde la web", maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value ? DOMPurify.sanitize(value) : value)
  notes?: string;
}

export class CreatePublicAppointmentDto {
  @ApiProperty({ example: "55555555-5555-4555-8555-555555555555" })
  @IsNotEmpty()
  @IsUUID()
  serviceId!: string;

  @ApiProperty({ example: "33333333-3333-4333-8333-333333333333" })
  @IsNotEmpty()
  @IsUUID()
  employeeId!: string;

  @ApiProperty({ example: "2026-08-10" })
  @IsNotEmpty()
  @IsString()
  appointmentDate!: string;

  @ApiProperty({ example: "09:00:00" })
  @IsNotEmpty()
  @IsString()
  startTime!: string;

  @ApiProperty({ type: PublicClientDto })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PublicClientDto)
  client!: PublicClientDto;
}
