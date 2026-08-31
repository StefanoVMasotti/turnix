import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { PublicController } from "./public.controller";
import { PublicService } from "./public.service";
import { PublicRepository } from "./public.repository";
import { PrismaService } from "../../database/prisma/prisma.service";

describe("Public Controller - Rate Limiting", () => {
  let app: INestApplication;

  const mockPublicService = {
    getLanding: jest.fn().mockResolvedValue({
      business: { id: "1", name: "Test", slug: "test", phone: null, email: null, address: null },
      settings: null,
      services: [],
      employees: []
    }),
    getAvailability: jest.fn().mockResolvedValue({ days: [] }),
    createAppointment: jest.fn().mockResolvedValue({ id: "apt-1" })
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([{
          name: "default",
          ttl: 60000,
          limit: 20
        }])
      ],
      controllers: [PublicController],
      providers: [
        { provide: APP_GUARD, useClass: ThrottlerGuard },
        { provide: PublicService, useValue: mockPublicService },
        { provide: PublicRepository, useValue: {} },
        { provide: PrismaService, useValue: {} }
      ]
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api");
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/public/:slug/appointments (limit: 5/min)", () => {
    const dto = {
      serviceId: "44444444-4444-4444-4444-444444444444",
      employeeId: "33333333-3333-3333-3333-333333333333",
      appointmentDate: "2026-09-15",
      startTime: "09:00:00",
      client: { firstName: "Test", lastName: "User", phone: "+5491100000001" }
    };

    it("debería permitir las primeras 5 requests (201)", async () => {
      for (let i = 0; i < 5; i++) {
        const res = await request(app.getHttpServer())
          .post("/api/public/test-slug/appointments")
          .send(dto);
        expect(res.status).toBe(201);
      }
    });

    it("debería bloquear la 6ta request (429)", async () => {
      for (let i = 0; i < 5; i++) {
        await request(app.getHttpServer())
          .post("/api/public/test-slug/appointments")
          .send(dto);
      }

      const res = await request(app.getHttpServer())
        .post("/api/public/test-slug/appointments")
        .send(dto);

      expect(res.status).toBe(429);
    });
  });

  describe("GET /api/public/:slug/availability (limit: 30/min)", () => {
    it("debería permitir requests dentro del límite", async () => {
      for (let i = 0; i < 5; i++) {
        const res = await request(app.getHttpServer())
          .get("/api/public/test-slug/availability")
          .query({ serviceId: "44444444-4444-4444-4444-444444444444" });
        expect(res.status).toBe(200);
      }
    });
  });
});
