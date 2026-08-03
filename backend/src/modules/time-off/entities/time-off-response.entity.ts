import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class TimeOffResponse {
  @ApiProperty({ example: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" })
  id!: string;

  @ApiProperty({ example: "33333333-3333-4333-8333-333333333333" })
  employeeId!: string;

  @ApiProperty({ example: "2026-07-25T00:00:00.000Z" })
  startDate!: Date;

  @ApiProperty({ example: "2026-07-28T00:00:00.000Z" })
  endDate!: Date;

  @ApiPropertyOptional({ example: "Vacaciones" })
  reason!: string | null;

  @ApiProperty({ example: "2026-07-13T11:00:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ example: "2026-07-13T11:00:00.000Z" })
  updatedAt!: Date;
}
