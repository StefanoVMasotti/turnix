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

## Reserva pública

El negocio se identifica en la URL pública mediante `slug` (único, auto-generado y editable).

Los endpoints públicos no usan `BusinessContextGuard` ni autenticación.

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
