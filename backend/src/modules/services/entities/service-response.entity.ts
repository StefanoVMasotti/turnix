import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ServiceResponse {
  @ApiProperty({ example: "55555555-5555-4555-8555-555555555555" })
  id!: string;

  @ApiProperty({ example: "11111111-1111-4111-8111-111111111111" })
  businessId!: string;

  @ApiProperty({ example: "Corte clásico" })
  name!: string;

  @ApiPropertyOptional({ example: "Corte masculino tradicional." })
  description!: string | null;

  @ApiProperty({ example: 30 })
  durationMinutes!: number;

  @ApiProperty({ example: true })
  active!: boolean;

  @ApiProperty({ example: "2026-07-13T11:00:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ example: "2026-07-13T11:00:00.000Z" })
  updatedAt!: Date;
}
