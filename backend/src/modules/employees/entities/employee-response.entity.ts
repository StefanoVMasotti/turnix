import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class EmployeeResponse {
  @ApiProperty({ example: "33333333-3333-4333-8333-333333333333" })
  id!: string;

  @ApiProperty({ example: "11111111-1111-4111-8111-111111111111" })
  businessId!: string;

  @ApiProperty({ example: "Alex" })
  firstName!: string;

  @ApiProperty({ example: "Ruiz" })
  lastName!: string;

  @ApiPropertyOptional({ example: "+54 11 5555-1111" })
  phone!: string | null;

  @ApiPropertyOptional({ example: "alex@turnix.app" })
  email!: string | null;

  @ApiProperty({ example: true })
  active!: boolean;

  @ApiProperty({ example: "2026-07-13T11:00:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ example: "2026-07-13T11:00:00.000Z" })
  updatedAt!: Date;
}
