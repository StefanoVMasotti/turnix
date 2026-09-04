import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import DOMPurify from "isomorphic-dompurify";

export class CreateTimeOffDto {
  @ApiProperty({ example: "33333333-3333-4333-8333-333333333333" })
  @IsNotEmpty()
  @IsUUID()
  employeeId!: string;

  @ApiProperty({ example: "2026-07-25" })
  @IsNotEmpty()
  @IsString()
  startDate!: string;

  @ApiProperty({ example: "2026-07-28" })
  @IsNotEmpty()
  @IsString()
  endDate!: string;

  @ApiPropertyOptional({ example: "Vacaciones", maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value ? DOMPurify.sanitize(value) : value)
  reason?: string;
}
