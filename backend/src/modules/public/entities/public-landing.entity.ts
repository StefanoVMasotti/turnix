import { ApiProperty } from "@nestjs/swagger";

export class PublicBusinessEntity {
  @ApiProperty({ example: "11111111-1111-4111-8111-111111111111" })
  id!: string;

  @ApiProperty({ example: "Turnix Demo" })
  name!: string;

  @ApiProperty({ example: "turnix-demo" })
  slug!: string;

  @ApiProperty({ example: "+54 11 5555-5555", nullable: true })
  phone!: string | null;

  @ApiProperty({ example: "demo@turnix.app", nullable: true })
  email!: string | null;

  @ApiProperty({ example: "Av. Corrientes 1234", nullable: true })
  address!: string | null;
}

export class PublicBusinessSettingsEntity {
  @ApiProperty({ example: "America/Buenos_Aires" })
  timezone!: string;

  @ApiProperty({ example: "ARS" })
  currency!: string;

  @ApiProperty({ example: 0 })
  bufferMinutes!: number;

  @ApiProperty({ example: 30 })
  maxBookingDays!: number;
}

export class PublicServiceEmployeeEntity {
  @ApiProperty({ example: "33333333-3333-4333-8333-333333333333" })
  employeeId!: string;

  @ApiProperty({ example: "Alex" })
  firstName!: string;

  @ApiProperty({ example: "Ruiz" })
  lastName!: string;

  @ApiProperty({ example: "8000.00" })
  price!: string;
}

export class PublicServiceEntity {
  @ApiProperty({ example: "55555555-5555-4555-8555-555555555555" })
  id!: string;

  @ApiProperty({ example: "Corte clásico" })
  name!: string;

  @ApiProperty({ example: "Corte masculino tradicional.", nullable: true })
  description!: string | null;

  @ApiProperty({ example: 30 })
  durationMinutes!: number;

  @ApiProperty({ type: [PublicServiceEmployeeEntity] })
  employees!: PublicServiceEmployeeEntity[];
}

export class PublicEmployeeEntity {
  @ApiProperty({ example: "33333333-3333-4333-8333-333333333333" })
  id!: string;

  @ApiProperty({ example: "Alex" })
  firstName!: string;

  @ApiProperty({ example: "Ruiz" })
  lastName!: string;
}

export class PublicLandingResponse {
  @ApiProperty({ type: PublicBusinessEntity })
  business!: PublicBusinessEntity;

  @ApiProperty({ type: PublicBusinessSettingsEntity, nullable: true })
  settings!: PublicBusinessSettingsEntity | null;

  @ApiProperty({ type: [PublicServiceEntity] })
  services!: PublicServiceEntity[];

  @ApiProperty({ type: [PublicEmployeeEntity] })
  employees!: PublicEmployeeEntity[];
}
