import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

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
  startTime!: string;

  @ApiProperty({ example: "17:00:00" })
  @IsNotEmpty()
  @IsString()
  endTime!: string;

  @ApiPropertyOptional({ example: "Reunión de equipo", maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;
}
