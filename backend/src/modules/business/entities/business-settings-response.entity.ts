import { ApiProperty } from "@nestjs/swagger";

export class BusinessSettingsResponse {
  @ApiProperty({ example: "22222222-2222-4222-8222-222222222222" })
  id!: string;

  @ApiProperty({ example: "11111111-1111-4111-8111-111111111111" })
  businessId!: string;

  @ApiProperty({ example: "America/Buenos_Aires" })
  timezone!: string;

  @ApiProperty({ example: "ARS" })
  currency!: string;

  @ApiProperty({ example: 30 })
  maxBookingDays!: number;

  @ApiProperty({ example: "2026-07-13T11:00:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ example: "2026-07-13T11:00:00.000Z" })
  updatedAt!: Date;
}
