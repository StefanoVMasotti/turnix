# Setup de Testing

## Stack

| Paquete | Version | Uso |
|---------|---------|-----|
| `jest` | ^30.x | Test runner |
| `ts-jest` | ^10.x | Transformacion TypeScript -> JS |
| `@types/jest` | ^30.x | Tipos de Jest |
| `supertest` | ^7.x | Tests HTTP (simula requests al servidor) |
| `@types/supertest` | ^6.x | Tipos de supertest |
| `@nestjs/testing` | ^11.x | Utilities de NestJS para tests |

## Configuracion

### jest.config.js

```js
module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  collectCoverageFrom: [
    "**/*.ts",
    "!**/*.module.ts",
    "!**/*.dto.ts",
    "!**/*.entity.ts",
    "!main.ts"
  ],
  coverageDirectory: "../coverage",
  testEnvironment: "node"
};
```

### tsconfig.json (adiciones)

```json
{
  "compilerOptions": {
    "types": ["jest", "node"]
  }
}
```

### package.json (scripts)

```json
{
  "scripts": {
    "test": "jest",
    "test:cov": "jest --coverage"
  }
}
```

## Instalacion

```bash
npm install -D jest ts-jest @types/jest supertest @types/supertest
```

## Ejecucion

```bash
npm test                    # Todos los tests
npm test -- --watch         # Watch mode
npm test -- public          # Solo tests que matcheen "public"
npm test -- --verbose       # Output detallado
npm run test:cov            # Con coverage report
```

## Coverage

El reporte se genera en `backend/coverage/`. Abrir `coverage/lcov-report/index.html` en el navegador.

Exclusiones configuradas:
- `*.module.ts` (modulos NestJS)
- `*.dto.ts` (DTOs)
- `*.entity.ts` (entidades Swagger)
- `main.ts` (bootstrap)
