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
