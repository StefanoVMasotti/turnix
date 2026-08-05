import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, IsUUID, Matches, Max, Min } from "class-validator";

export class CreateScheduleDto {
  @ApiProperty({ example: "33333333-3333-4333-8333-333333333333" })
  @IsNotEmpty()
  @IsUUID()
  employeeId!: string;

  @ApiProperty({ example: 1, minimum: 0, maximum: 6 })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek!: number;

  @ApiProperty({ example: "09:00" })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
  startTime!: string;

  @ApiProperty({ example: "17:00" })
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/)
  endTime!: string;
}
