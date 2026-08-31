# Testing - Turnix Backend

Documentación del sistema de testing del backend.

## Archivos

| Archivo | Descripcion |
|---------|-------------|
| [setup.md](./setup.md) | Instalacion y configuracion de Jest |
| [architecture.md](./architecture.md) | Patron de testing, mocking, y convenciones |

## Comandos

```bash
npm test              # Ejecutar todos los tests
npm run test:cov      # Ejecutar con coverage
```

## Tests existentes

| Suite | Archivo | Tests | Que valida |
|-------|---------|-------|------------|
| Race Condition | `src/modules/public/public.repository.spec.ts` | 4 | Deteccion de duplicados via Prisma P2002 |
| Rate Limiting | `src/modules/public/public.controller.spec.ts` | 3 | Throttler en endpoints publicos |
| RBAC | `src/common/guards/roles.guard.spec.ts` | 7 | Control de acceso por roles |

## Estructura de archivos de test

Los archivos de test van junto al archivo que testean:

```
src/
  modules/
    public/
      public.repository.ts
      public.repository.spec.ts    <- test unitario
      public.controller.ts
      public.controller.spec.ts    <- test de integracion con HTTP
  common/
    guards/
      roles.guard.ts
      roles.guard.spec.ts          <- test unitario del guard
```

Convencion: `*.spec.ts` para tests unitarios, `*.e2e-spec.ts` para e2e.
