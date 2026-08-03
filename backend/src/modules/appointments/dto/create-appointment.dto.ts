import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateAppointmentDto {
  @ApiProperty({ example: "44444444-4444-4444-4444-444444444444" })
  @IsNotEmpty()
  @IsUUID()
  clientId!: string;

  @ApiProperty({ example: "33333333-3333-4333-8333-333333333333" })
  @IsNotEmpty()
  @IsUUID()
  employeeId!: string;

  @ApiProperty({ example: "66666666-6666-4666-8666-666666666666" })
  @IsNotEmpty()
  @IsUUID()
  serviceId!: string;

  @ApiProperty({ example: "2026-07-25" })
  @IsNotEmpty()
  @IsString()
  appointmentDate!: string;

  @ApiProperty({ example: "09:00:00" })
  @IsNotEmpty()
  @IsString()
  startTime!: string;

  @ApiProperty({ example: "09:30:00" })
  @IsNotEmpty()
  @IsString()
  endTime!: string;

  @ApiPropertyOptional({ example: "web", enum: ["web", "whatsapp", "phone", "walk_in"] })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  bookingSource?: string;

  @ApiPropertyOptional({ example: "Cliente pidió turno temprano" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  notes?: string;
}
