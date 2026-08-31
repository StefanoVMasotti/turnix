import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException } from "@nestjs/common";
import { PublicRepository } from "./public.repository";
import { PrismaService } from "../../database/prisma/prisma.service";

function createPrismaError(code: string, meta: { target: string[] }) {
  const error = Object.assign(new Error("Prisma error"), { code, meta });
  return error;
}

describe("PublicRepository - Race Condition (createAppointment)", () => {
  let repository: PublicRepository;
  let prisma: { appointment: { create: jest.Mock } };

  beforeEach(async () => {
    prisma = { appointment: { create: jest.fn() } };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicRepository,
        { provide: PrismaService, useValue: prisma }
      ]
    }).compile();

    repository = module.get(PublicRepository);
  });

  const validData = {
    businessId: "11111111-1111-1111-1111-111111111111",
    clientId: "22222222-2222-2222-2222-222222222222",
    employeeId: "33333333-3333-3333-3333-333333333333",
    serviceId: "44444444-4444-4444-4444-444444444444",
    appointmentDate: new Date("2026-09-15"),
    startTime: "09:00:00",
    endTime: "09:30:00",
    status: "scheduled" as const,
    bookingSource: "web" as const
  };

  it("debería crear el appointment exitosamente", async () => {
    const expected = { id: "uuid-1", ...validData };
    prisma.appointment.create.mockResolvedValue(expected);

    const result = await repository.createAppointment(validData);

    expect(result).toEqual(expected);
    expect(prisma.appointment.create).toHaveBeenCalledWith({ data: validData });
  });

  it("debería lanzar ConflictException cuando Prisma lanza P2002 (doble reserva)", async () => {
    const prismaError = createPrismaError("P2002", {
      target: ["employee_id", "appointment_date", "start_time"]
    });
    prisma.appointment.create.mockRejectedValue(prismaError);

    await expect(repository.createAppointment(validData)).rejects.toThrow(ConflictException);
    await expect(repository.createAppointment(validData)).rejects.toThrow(
      "El horario ya fue reservado por otro cliente"
    );
  });

  it("debería relanzar errores de Prisma que no son P2002", async () => {
    const dbError = createPrismaError("P2003", { target: [] });
    prisma.appointment.create.mockRejectedValue(dbError);

    await expect(repository.createAppointment(validData)).rejects.toThrow("Prisma error");
  });

  it("debería relanzar errores desconocidos sin modificar", async () => {
    prisma.appointment.create.mockRejectedValue(new Error("Unexpected error"));

    await expect(repository.createAppointment(validData)).rejects.toThrow("Unexpected error");
  });
});
