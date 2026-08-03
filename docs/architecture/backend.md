# Arquitectura Backend

## Introducción

El backend de Turnix será desarrollado utilizando NestJS y TypeScript.

Se utilizará una arquitectura modular basada en responsabilidades, permitiendo mantener un código organizado, escalable y fácil de mantener.

---

# Stack

- NestJS
- TypeScript
- PostgreSQL
- Supabase
- Prisma ORM
- JWT
- Swagger
- Class Validator

---

# Arquitectura

```text
Controller

↓

Service

↓

Repository

↓

Prisma Client

↓

PostgreSQL
```

Cada capa tiene una única responsabilidad.

---

# Estructura del proyecto

```text
src/
│
├── common/
├── config/
├── database/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── prisma.service.ts
│
├── modules/
└── main.ts
```

---

# common/

Código reutilizable.

Ejemplos:

guards

filters

interceptors

decorators

pipes

exceptions

middlewares

utils

---

# config/

Configuraciones del proyecto.

Variables de entorno.

JWT.

Supabase.

Swagger.

---

# database/

Configuración de PostgreSQL.

Conexión.

Migraciones.

Seeds.

---

# modules/

Cada módulo representa una funcionalidad del sistema.

Ejemplo:

Auth

Business

Employees

Services

Clients

Appointments

Schedules

Cada módulo tendrá su propia estructura.

```text
employees/

employee.controller.ts

employee.service.ts

employee.repository.ts

employee.module.ts

dto/

entities/
```

---

# Controllers

Responsables de recibir las solicitudes HTTP.

No contienen lógica de negocio.

---

# Services

Implementan las reglas del sistema.

Ejemplos:

Validar disponibilidad.

Crear turnos.

Cancelar reservas.

Actualizar horarios.

---

# Repositories

Los Repositories son responsables del acceso a los datos.

Utilizan Prisma Client para interactuar con PostgreSQL.

Toda consulta, inserción, actualización o eliminación deberá realizarse desde esta capa.

Los Services nunca accederán directamente a Prisma Client.

---

# DTO

Se utilizarán Data Transfer Objects para validar todas las entradas.

Ejemplo:

CreateEmployeeDto

UpdateEmployeeDto

CreateAppointmentDto

---

# Validaciones

Toda información recibida será validada antes de llegar al Service.

No se confiará en datos provenientes del cliente.

---

# Prisma

Se utilizará Prisma ORM como herramienta de acceso a datos.

Responsabilidades:

- Gestionar el esquema de la base de datos.
- Ejecutar migraciones.
- Generar Prisma Client.
- Proveer acceso tipado a PostgreSQL.

Todas las modificaciones del esquema deberán realizarse mediante migraciones versionadas.

---

# Swagger

Toda la API estará documentada utilizando Swagger.

Cada endpoint deberá incluir:

Descripción

Request

Response

Errores posibles

---

# Seguridad

Se utilizará autenticación mediante JWT.

Las rutas administrativas estarán protegidas mediante Guards.

---

## Acceso a datos

El acceso a la base de datos se realizará mediante Prisma ORM.

Las modificaciones del esquema se gestionarán mediante migraciones versionadas.

Todas las consultas serán realizadas desde la capa Repository utilizando Prisma Client.

---

# Filosofía

Toda la lógica del negocio debe vivir en los Services.

Los Controllers solamente reciben solicitudes.

Los Repositories solamente acceden a la base de datos.

La arquitectura debe permitir agregar nuevos módulos sin modificar los existentes.
