import { ApiProperty } from "@nestjs/swagger";

export class AvailabilityDayEntity {
  @ApiProperty({ example: "2026-08-10" })
  date!: string;

  @ApiProperty({ example: true })
  available!: boolean;

  @ApiProperty({ example: 16 })
  slotsCount!: number;
}

export class AvailabilitySlotEntity {
  @ApiProperty({ example: "09:00:00" })
  startTime!: string;

  @ApiProperty({ example: "09:30:00" })
  endTime!: string;
}

export class AvailabilitySlotsEntity {
  @ApiProperty({ example: "2026-08-10" })
  date!: string;

  @ApiProperty({ type: [AvailabilitySlotEntity] })
  slots!: AvailabilitySlotEntity[];
}
