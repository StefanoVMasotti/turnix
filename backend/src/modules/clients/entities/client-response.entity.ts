import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ClientResponse {
  @ApiProperty({ example: "77777777-7777-4777-8777-777777777777" })
  id!: string;

  @ApiProperty({ example: "11111111-1111-4111-8111-111111111111" })
  businessId!: string;

  @ApiProperty({ example: "Cliente" })
  firstName!: string;

  @ApiProperty({ example: "Demo" })
  lastName!: string;

  @ApiProperty({ example: "+54 11 5555-9999" })
  phone!: string;

  @ApiPropertyOptional({ example: "cliente.demo@turnix.app" })
  email!: string | null;

  @ApiPropertyOptional({ example: "Cliente frecuente" })
  notes!: string | null;

  @ApiProperty({ example: "2026-07-13T11:00:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ example: "2026-07-13T11:00:00.000Z" })
  updatedAt!: Date;
}
