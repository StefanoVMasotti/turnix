import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class UpdateScheduleDto {
  @ApiPropertyOptional({ example: 1, minimum: 0, maximum: 6 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek?: number;

  @ApiPropertyOptional({ example: "09:00" })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ example: "17:00" })
  @IsOptional()
  @IsString()
  endTime?: string;
}
