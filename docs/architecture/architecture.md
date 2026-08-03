# Arquitectura del Proyecto

## Introducción

Turnix es una plataforma SaaS para la gestión de turnos orientada inicialmente a peluquerías y barberías, pero diseñada para adaptarse a cualquier negocio basado en reservas.

Desde el inicio, el proyecto fue pensado con una arquitectura escalable, modular y mantenible, permitiendo incorporar nuevas funcionalidades sin afectar el núcleo de la aplicación.

---

# Arquitectura General

La comunicación entre los distintos componentes del sistema sigue la siguiente estructura:

```text
                React + Vite
                     │
                     │ REST API
                     ▼
                 NestJS Backend
                     │
                     ▼
             PostgreSQL (Supabase)
```

El frontend nunca accede directamente a la base de datos.

Toda la lógica de negocio pasa por el backend.

---

# Principios de Arquitectura

Durante el desarrollo se seguirán los siguientes principios:

- Responsabilidad única (Single Responsibility Principle)
- Separación de responsabilidades
- Código reutilizable
- Componentes desacoplados
- Escalabilidad
- Modularidad
- Tipado estricto mediante TypeScript

---

# Arquitectura del Backend

El backend implementa una arquitectura por capas.

```text
Controller
      │
      ▼
Service
      │
      ▼
Repository
      │
      ▼
Database
```

## Controllers

Reciben las solicitudes HTTP.

Responsabilidades:

- Recibir Requests
- Validar entrada
- Invocar Services
- Devolver Responses

No contienen lógica de negocio.

---

## Services

Representan el corazón del sistema.

Responsabilidades:

- Reglas de negocio
- Validaciones
- Orquestación
- Procesamiento de datos

Toda decisión importante ocurre aquí.

---

## Repositories

Son la única capa que interactúa con PostgreSQL.

Responsabilidades:

- Consultas SQL
- Inserciones
- Actualizaciones
- Eliminaciones

El resto de la aplicación nunca consulta directamente la base de datos.

---

# Arquitectura del Frontend

El frontend sigue una arquitectura basada en componentes reutilizables.

```text
Pages
    │
    ▼
Layouts
    │
    ▼
Components
```

Cada componente debe tener una única responsabilidad.

Ejemplos:

- Button
- Input
- Modal
- Card
- Calendar
- ProfessionalCard
- ServiceCard

---

# Gestión del Estado

Se utilizarán diferentes herramientas según el tipo de información.

## Zustand

Para estado global.

Ejemplos:

- Usuario autenticado
- Configuración
- Preferencias

## TanStack Query

Para estado del servidor.

Ejemplos:

- Servicios
- Empleados
- Turnos
- Clientes

La información obtenida desde la API no será almacenada manualmente.

---

# Comunicación

La comunicación seguirá el siguiente flujo:

```text
React

↓

Axios

↓

REST API

↓

NestJS

↓

Repository

↓

Supabase PostgreSQL
```

Todas las peticiones utilizarán JSON.

---

# Autenticación

Los clientes no necesitarán autenticarse para reservar un turno.

El acceso administrativo requerirá autenticación mediante Supabase Auth y JWT.

---

# Base de Datos

El sistema fue diseñado para soportar múltiples negocios desde la primera versión.

Cada entidad principal pertenece a un Business.

Ejemplo:

Business

├── Employees

├── Services

├── Clients

└── Appointments

---

# Escalabilidad

La arquitectura fue diseñada para facilitar futuras integraciones.

Versiones futuras contemplan:

- WhatsApp Business
- Automatizaciones mediante n8n
- Aplicación móvil
- Pagos online
- Recordatorios automáticos
- Estadísticas avanzadas
- Sistema multiempresa completo

---

# Filosofía del Proyecto

Turnix no busca resolver únicamente la reserva de turnos.

Su objetivo es convertirse en una plataforma de gestión para negocios que trabajan mediante citas, manteniendo una arquitectura limpia, escalable y preparada para evolucionar sin grandes refactorizaciones.
