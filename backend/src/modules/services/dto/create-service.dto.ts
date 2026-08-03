import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

export class CreateServiceDto {
  @ApiProperty({ example: "Corte clásico", maxLength: 100 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({ example: "Corte masculino tradicional." })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 30, minimum: 5, maximum: 480 })
  @IsNotEmpty()
  @IsInt()
  @Min(5)
  @Max(480)
  durationMinutes!: number;
}
