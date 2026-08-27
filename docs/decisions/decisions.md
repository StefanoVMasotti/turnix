# Decisiones de Arquitectura

## Nombre

Turnix

Sistema SaaS para gestión de turnos.

---

## Frontend

React + Vite + TypeScript

Motivo:

- SPA
- Desarrollo rápido
- Excelente ecosistema

---

## Backend

NestJS

Motivo:

- Arquitectura modular
- Escalable
- Utilizado en proyectos profesionales

---

## Base de datos

Supabase PostgreSQL

Motivo:

- PostgreSQL administrado
- Excelente integración
- Escalable

---

## Arquitectura

Layered Architecture

Controller

↓

Service

↓

Repository

↓

Prisma Client

↓

PostgreSQL

---

## Multiempresa

El sistema será multiempresa desde la primera versión.

---

## Clientes

Los clientes no requieren autenticación.

---

## Horarios

Los horarios disponibles se calculan dinámicamente.

No existe una tabla de slots.

---

## Timezone (v1)

Wall-clock local naive.

Los horarios se almacenan como hora local del negocio sin conversión.

`BusinessSettings.timezone` es la fuente de verdad del huso del negocio.

La manipulación de fechas está centralizada en utilidades (backend `common/utils/time.ts`, frontend `src/utils/date.ts`), dejando preparada una futura migración a UTC.

---

## Auth

El sistema de autenticación utiliza **Supabase Auth** como proveedor.

**Proveedor:** Supabase Auth

**Flujo:**
1. Frontend envía email + password a `POST /auth/login`
2. Backend valida credenciales con Supabase Auth
3. Backend busca el usuario en Prisma por `authUserId`
4. Retorna JWT + datos del usuario

**Protección de endpoints:**
- `JwtGuard` verifica el token Bearer y setea `request.user`
- `RolesGuard` valida roles (owner/admin) mediante decorador `@Roles()`
- El `businessId` sale del JWT, nunca de headers

**Roles:**
- `owner`: acceso total (CRUD usuarios, configuración, todo)
- `admin`: acceso a operaciones del panel (no puede gestionar usuarios)

---

## Multi-tenancy

**Modelo:** 1 usuario = 1 negocio

El `businessId` se obtiene del JWT (que Supabase firma).

Los endpoints públicos (`/public/*`) no requieren autenticación y se identifican por `slug`.

Los endpoints administrativos requieren `Authorization: Bearer <token>`.

El header `x-business-id` fue eliminado por razones de seguridad.

---

## Soft Delete

Se utiliza soft delete (campo `active`) en:

- Services
- Employees
- Employee Services
- Users

Se utiliza hard delete en:

- Schedules
- Time Off
- Blocks
- Appointments

---

## Reserva pública

El negocio se identifica en la URL pública mediante `slug` (único, auto-generado y editable).

Los endpoints públicos no requieren autenticación.

Un único endpoint de disponibilidad:

- Sin `date` → días disponibles del booking window.
- Con `date` → slots del día.

---

## Servicios

Relación muchos a muchos entre empleados y servicios.

---

## Diseño

Primero el cliente selecciona:

Servicio

↓

Profesional

↓

Horario

---

## ORM

Prisma

Motivo:

- Excelente DX.
- Muy buen soporte para TypeScript.
- Compatible con Supabase.
- Migraciones integradas.

---

## Objetivo

Construir un producto reutilizable para cualquier negocio basado en reservas.
