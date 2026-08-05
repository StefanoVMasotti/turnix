import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID, Matches, MaxLength } from "class-validator";

export class CreateBlockDto {
  @ApiProperty({ example: "33333333-3333-4333-8333-333333333333" })
  @IsNotEmpty()
  @IsUUID()
  employeeId!: string;

  @ApiProperty({ example: "2026-07-25" })
  @IsNotEmpty()
  @IsString()
  blockDate!: string;

  @ApiProperty({ example: "09:00:00" })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
  startTime!: string;

  @ApiProperty({ example: "17:00:00" })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
  endTime!: string;

  @ApiPropertyOptional({ example: "Reunión de equipo", maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;
}
