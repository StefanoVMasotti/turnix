import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class AppointmentResponse {
  @ApiProperty({ example: "77777777-7777-4777-8777-777777777777" })
  id!: string;

  @ApiProperty({ example: "11111111-1111-4111-8111-111111111111" })
  businessId!: string;

  @ApiProperty({ example: "44444444-4444-4444-4444-444444444444" })
  clientId!: string;

  @ApiProperty({ example: "33333333-3333-4333-8333-333333333333" })
  employeeId!: string;

  @ApiProperty({ example: "66666666-6666-4666-8666-666666666666" })
  serviceId!: string;

  @ApiProperty({ example: "2026-07-25" })
  appointmentDate!: Date;

  @ApiProperty({ example: "09:00:00" })
  startTime!: Date;

  @ApiProperty({ example: "09:30:00" })
  endTime!: Date;

  @ApiProperty({ example: "scheduled", enum: ["scheduled", "completed", "cancelled", "no_show"] })
  status!: string;

  @ApiProperty({ example: "web", enum: ["web", "whatsapp", "phone", "walk_in"] })
  bookingSource!: string;

  @ApiPropertyOptional({ example: "Cliente pidió turno temprano" })
  notes!: string | null;

  @ApiProperty({ example: "2026-07-13T11:00:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ example: "2026-07-13T11:00:00.000Z" })
  updatedAt!: Date;
}
