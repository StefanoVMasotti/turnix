# Arquitectura de Testing

## Tipos de tests

### 1. Unit Tests (tests unitarios)

Testean una unidad de codigo en aislamiento, con dependencias mockeadas.

**Ubicacion:** Junto al archivo fuente (`*.spec.ts`)

**Patron:**
```typescript
import { Test, TestingModule } from "@nestjs/testing";
import { MiServicio } from "./mi.servicio";
import { MiRepositorio } from "./mi.repositorio";

describe("MiServicio", () => {
  let servicio: MiServicio;
  let repositorio: { metodo: jest.Mock };

  beforeEach(async () => {
    repositorio = { metodo: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MiServicio,
        { provide: MiRepositorio, useValue: repositorio }
      ]
    }).compile();

    servicio = module.get(MiServicio);
  });

  it("deberia hacer algo", async () => {
    repositorio.metodo.mockResolvedValue(datoMock);
    const resultado = await servicio.miMetodo();
    expect(resultado).toBe(esperado);
  });
});
```

**Clave:** Siempre mockear dependencias externas (Prisma, HTTP, etc.).

### 2. Integration Tests (tests de integracion)

Testean multiples componentes juntos, incluyendo HTTP real.

**Ubicacion:** Junto al controller (`*.controller.spec.ts`)

**Patron:**
```typescript
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { MiController } from "./mi.controller";
import { MiServicio } from "./mi.servicio";

describe("MiController", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot([...])],
      controllers: [MiController],
      providers: [
        { provide: APP_GUARD, useClass: ThrottlerGuard },
        { provide: MiServicio, useValue: mockServicio }
      ]
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(() => app.close());

  it("GET /api/recurso", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/recurso");
    expect(res.status).toBe(200);
  });
});
```

**Clave:** Usar `supertest` para simular requests HTTP reales.

### 3. Guard Tests (tests de guards)

Testean la logica de autenticacion/autorizacion mockeando el contexto de ejecucion.

**Ubicacion:** Junto al guard (`*.guard.spec.ts`)

**Patron:**
```typescript
import { ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolesGuard } from "./roles.guard";

describe("RolesGuard", () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  function mockContext(user?: { role: string }) {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user })
      }),
      getHandler: () => jest.fn(),
      getClass: () => jest.fn()
    } as unknown as ExecutionContext;
  }

  it("deberia denegar si no tiene el rol", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(["admin"]);
    expect(() => guard.canActivate(mockContext({ role: "user" })))
      .toThrow(ForbiddenException);
  });
});
```

## Mocking de Prisma

Prisma no se puede instanciar en tests. Se mockea asi:

```typescript
const prisma = {
  appointment: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn()
  }
};

// En el TestingModule:
{ provide: PrismaService, useValue: prisma }

// En el test:
prisma.appointment.create.mockResolvedValue(resultado);
prisma.appointment.create.mockRejectedValue(error);
```

### Mockeando errores de Prisma

Los errores de Prisma (P2002, P2003, etc.) tienen la estructura:

```typescript
function createPrismaError(code: string, meta: { target: string[] }) {
  const error = Object.assign(new Error("Prisma error"), { code, meta });
  return error;
}

// Uso:
prisma.appointment.create.mockRejectedValue(
  createPrismaError("P2002", {
    target: ["employee_id", "appointment_date", "start_time"]
  })
);
```

**Importante:** Prisma retorna los nombres de columnas DB (snake_case), no los nombres de campos Prisma (camelCase). Verificar el schema.prisma para saber que nombres retorna `meta.target`.

## Mockeando Guards

Para testear un controller sin pasar por JWT:

```typescript
// Mockear JwtGuard para que siempre pase
const module = await Test.createTestingModule({
  controllers: [MiController],
  providers: [
    { provide: JwtGuard, useValue: { canActivate: () => true } },
    { provide: RolesGuard, useValue: { canActivate: () => true } }
  ]
}).compile();
```

O usar `.overrideGuard()`:

```typescript
const module = await Test.createTestingModule({...})
  .overrideGuard(JwtGuard)
  .useValue({ canActivate: () => true })
  .compile();
```

## Convenciones

1. **Un test file por archivo fuente** - `mi.servicio.ts` -> `mi.servicio.spec.ts`
2. **Descripcion en espanol** - `"deberia crear el turno"` no `"should create appointment"`
3. **beforeEach para estado limpio** - Siempre limpiar mocks entre tests
4. **Nombres descriptivos** - El nombre del test describe que escenario valida
5. **Un assert por test idealmente** - Tests que fallan deben ser faciles de diagnosticar
