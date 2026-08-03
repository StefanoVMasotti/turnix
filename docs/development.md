# Desarrollo

## Requisitos

- Node.js 22 o superior
- npm 10 o superior
- PostgreSQL o Supabase

---

## Instalación

```bash
npm install
```

---

## Variables de entorno

Crear los archivos locales a partir de los ejemplos:

- `.env.example`
- `backend/.env.example`
- `frontend/.env.example`

El backend necesita `DATABASE_URL` apuntando a PostgreSQL o Supabase antes de ejecutar migraciones.

---

## Comandos

```bash
npm run dev:backend
npm run dev:frontend
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

Si Prisma no puede regenerar el client en Windows por un archivo bloqueado, cerrar los procesos `dev:backend` y volver a ejecutar `npm run prisma:generate`.

---

## Base de datos

Flujo inicial recomendado:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

La migración inicial se encuentra en `backend/prisma/migrations/20260713110000_init/migration.sql`.

---

## URLs locales

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`
- Health: `http://localhost:3000/api/health`
