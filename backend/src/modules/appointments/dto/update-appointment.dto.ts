import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class UpdateAppointmentDto {
  @ApiPropertyOptional({ example: "44444444-4444-4444-4444-444444444444" })
  @IsOptional()
  @IsUUID()
  clientId?: string;

  @ApiPropertyOptional({ example: "33333333-3333-4333-8333-333333333333" })
  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @ApiPropertyOptional({ example: "66666666-6666-4666-8666-666666666666" })
  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @ApiPropertyOptional({ example: "2026-07-25" })
  @IsOptional()
  @IsString()
  appointmentDate?: string;

  @ApiPropertyOptional({ example: "10:00:00" })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ example: "10:30:00" })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({ example: "completed", enum: ["scheduled", "completed", "cancelled", "no_show"] })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;

  @ApiPropertyOptional({ example: " Cliente pidió cambio de hora" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  notes?: string;
}
