import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator";

export class CreateEmployeeServiceDto {
  @ApiProperty({ example: "33333333-3333-4333-8333-333333333333" })
  @IsNotEmpty()
  @IsUUID()
  employeeId!: string;

  @ApiProperty({ example: "55555555-5555-4555-8555-555555555555" })
  @IsNotEmpty()
  @IsUUID()
  serviceId!: string;

  @ApiProperty({ example: 8000, minimum: 0 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 0 })
  @Min(0)
  price!: number;
}
