# Contribuir a Turnix

Guía para contribuir al proyecto Turnix.

---

## Requisitos previos

- Node.js 22 o superior
- npm 10 o superior
- PostgreSQL o Supabase
- Git

---

## Instalación

```bash
git clone <url-del-repositorio>
cd turnix
npm install
```

Configurar variables de entorno:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Ejecutar migraciones y seed:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

Iniciar en desarrollo:

```bash
npm run dev:backend
npm run dev:frontend
```

---

## Flujo de trabajo Git

### Ramas

- `main` → producción estable
- `develop` → integración
- `feature/nombre-descriptivo` → nuevas funcionalidades
- `fix/nombre-descriptivo` → corrección de bugs

### Commits

Commits pequeños y descriptivos. Formato recomendado:

```
tipo: descripción breve

Ejemplos:
feat: agregar CRUD de servicios
fix: corregir cálculo de disponibilidad
refactor: extraer lógica de horarios a util
docs: actualizar endpoints de la API
```

Tipos:

- `feat` → nueva funcionalidad
- `fix` → corrección de bug
- `refactor` → reestructuración sin cambio de comportamiento
- `docs` → documentación
- `style` → formato, espacios, etc.
- `test` → tests
- `chore` → tareas de mantenimiento

### Pull Requests

1. Crear rama desde `develop`
2. Implementar la funcionalidad
3. Asegurar que no haya errores de TypeScript
4. Actualizar documentación si aplica
5. Crear PR con descripción clara
6. Esperar review

---

## Convenciones de código

### Generales

- TypeScript estricto. No usar `any`.
- Todo código debe estar tipado.
- Nombres en inglés.
- Comentarios y documentación en español.
- No superar 250 líneas por archivo (salvo excepciones justificadas).

### Backend (NestJS)

- Arquitectura por capas: Controller → Service → Repository → Prisma
- Toda lógica de negocio vive en Services
- Controllers solo reciben requests y devuelven responses
- Repositories son la única capa que accede a la base de datos
- Usar DTOs para todas las entradas
- Documentar todos los endpoints con Swagger
- Utilizar `BusinessContextGuard` para endpoints administrativos
- Los endpoints públicos no requieren autenticación

### Frontend (React)

- No realizar llamadas HTTP desde componentes
- Usar TanStack Query para datos del servidor
- Usar Zustand solo para estado global
- Componentes pequeños y reutilizables
- Separar: pages → layouts → components
- Services para comunicación con la API
- Hooks para lógica reutilizable

### Base de Datos

- Todos los IDs son UUID
- Todas las tablas tienen `created_at` y `updated_at`
- Soft delete en Services, Employees, Employee Services
- Hard delete en Schedules, Time Off, Blocks, Appointments
- No eliminar registros importantes físicamente cuando exista alternativa

---

## Estructura del proyecto

```
turnix/
├── docs/              # Documentación del proyecto
├── frontend/          # React + Vite + TypeScript
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       ├── store/
│       ├── types/
│       └── utils/
├── backend/           # NestJS + Prisma
│   └── src/
│       ├── common/
│       ├── config/
│       ├── database/
│       └── modules/
└── package.json
```

---

## Antes de contribuir

1. Revisar `docs/project-rules.md`
2. Revisar `docs/architecture/`
3. Revisar `docs/decisions/`
4. Verificar que la funcionalidad no exista ya
5. Consultar el roadmap en `docs/roadmap/roadmap.md`

---

## Preguntas

Para dudas o sugerencias, abrir un issue en el repositorio.
