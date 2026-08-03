## Estado del proyecto

En desarrollo.

Actualmente se encuentra en fase de diseño de arquitectura e implementación del MVP.

# Turnix

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![Status](https://img.shields.io/badge/Status-In%20Development-orange)

# Turnix

Turnix es una plataforma SaaS para la gestión de turnos, diseñada inicialmente para peluquerías y barberías, pero preparada para adaptarse a cualquier negocio basado en reservas.

El objetivo del proyecto es ofrecer una experiencia simple para el cliente al reservar un turno y una herramienta completa para que los administradores gestionen empleados, servicios, horarios y reservas desde un único lugar.

---

## Características

### Cliente

- Reserva de turnos online.
- Selección de servicio.
- Selección de profesional.
- Visualización de horarios disponibles.
- Confirmación de la reserva.
- Diseño responsive.

### Administrador

- Dashboard.
- Gestión de empleados.
- Gestión de servicios.
- Configuración de horarios.
- Gestión de ausencias y bloqueos.
- Administración de turnos.
- Gestión de clientes.

---

## Tecnologías

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Zustand
- React Hook Form
- Zod
- Axios

### Backend

- NestJS
- TypeScript
- JWT Authentication
- Swagger
- Zod / Class Validator

### Base de Datos

- PostgreSQL
- Supabase

### Herramientas

- Git
- GitHub
- Figma
- Postman

---

## Arquitectura

El proyecto sigue una arquitectura por capas (Layered Architecture).

```
Frontend
        │
        ▼
 REST API
        │
        ▼
 Controllers
        │
        ▼
  Services
        │
        ▼
Repositories
        │
        ▼
 PostgreSQL
```

Cada capa tiene una única responsabilidad, facilitando el mantenimiento y la escalabilidad del sistema.

---

## Estructura del proyecto

```
turnix/

├── docs/
├── frontend/
└── backend/
```

La documentación del proyecto se encuentra dentro de la carpeta **docs**.

---

## Documentación

Dentro de `docs/` se encuentra toda la documentación del proyecto.

- Arquitectura
- Base de datos
- API
- UX/UI
- Roadmap
- Decisiones de diseño

---

## Objetivos del proyecto

- Construir una plataforma escalable.
- Aplicar buenas prácticas de arquitectura.
- Implementar una API REST profesional.
- Diseñar una interfaz intuitiva.
- Preparar el sistema para múltiples negocios.
- Integrar WhatsApp y automatizaciones en futuras versiones.

---

## Roadmap

- [ ] Configuración inicial
- [ ] Autenticación
- [ ] Gestión de servicios
- [ ] Gestión de empleados
- [ ] Gestión de horarios
- [ ] Gestión de clientes
- [ ] Gestión de turnos
- [ ] Dashboard
- [ ] Integración con WhatsApp
- [ ] Automatizaciones con n8n

---

## Autor

**Stefano Victorio Masotti**

GitHub: _(Agregar enlace)_

LinkedIn: _(Agregar enlace)_

---

## Licencia

Proyecto desarrollado con fines educativos y como portfolio personal.
