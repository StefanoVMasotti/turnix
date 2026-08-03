import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class BlockResponse {
  @ApiProperty({ example: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" })
  id!: string;

  @ApiProperty({ example: "33333333-3333-4333-8333-333333333333" })
  employeeId!: string;

  @ApiProperty({ example: "2026-07-25T00:00:00.000Z" })
  blockDate!: Date;

  @ApiProperty({ example: "1970-01-01T09:00:00.000Z" })
  startTime!: Date;

  @ApiProperty({ example: "1970-01-01T17:00:00.000Z" })
  endTime!: Date;

  @ApiPropertyOptional({ example: "Reunión de equipo" })
  reason!: string | null;

  @ApiProperty({ example: "2026-07-13T11:00:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ example: "2026-07-13T11:00:00.000Z" })
  updatedAt!: Date;
}
