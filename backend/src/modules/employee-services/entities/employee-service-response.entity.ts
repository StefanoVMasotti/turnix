import { ApiProperty } from "@nestjs/swagger";

export class EmployeeServiceResponse {
  @ApiProperty({ example: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee" })
  id!: string;

  @ApiProperty({ example: "33333333-3333-4333-8333-333333333333" })
  employeeId!: string;

  @ApiProperty({ example: "55555555-5555-4555-8555-555555555555" })
  serviceId!: string;

  @ApiProperty({ example: 8000 })
  price!: number;

  @ApiProperty({ example: true })
  active!: boolean;

  @ApiProperty({ example: "2026-07-13T11:00:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ example: "2026-07-13T11:00:00.000Z" })
  updatedAt!: Date;
}
