import { ApiProperty } from "@nestjs/swagger";

export class BusinessResponse {
  @ApiProperty({ example: "11111111-1111-4111-8111-111111111111" })
  id!: string;

  @ApiProperty({ example: "Turnix Demo" })
  name!: string;

  @ApiProperty({ example: "+54 11 5555-5555", nullable: true })
  phone!: string | null;

  @ApiProperty({ example: "demo@turnix.app", nullable: true })
  email!: string | null;

  @ApiProperty({ example: "Av. Corrientes 1234", nullable: true })
  address!: string | null;

  @ApiProperty({ example: true })
  active!: boolean;

  @ApiProperty({ example: "2026-07-13T11:00:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ example: "2026-07-13T11:00:00.000Z" })
  updatedAt!: Date;
}
