import { ApiProperty } from "@nestjs/swagger";

export class ScheduleResponse {
  @ApiProperty({ example: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" })
  id!: string;

  @ApiProperty({ example: "33333333-3333-4333-8333-333333333333" })
  employeeId!: string;

  @ApiProperty({ example: 1 })
  dayOfWeek!: number;

  @ApiProperty({ example: "09:00:00" })
  startTime!: string;

  @ApiProperty({ example: "17:00:00" })
  endTime!: string;

  @ApiProperty({ example: "2026-07-13T11:00:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ example: "2026-07-13T11:00:00.000Z" })
  updatedAt!: Date;
}
