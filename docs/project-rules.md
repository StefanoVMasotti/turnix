# Reglas del Proyecto

## Generales

- Utilizar TypeScript estricto.
- No usar `any`.
- Todo código debe estar tipado.
- Mantener nombres en inglés.
- Mantener comentarios y documentación en español.

---

## Frontend

- No realizar llamadas HTTP desde componentes.
- Utilizar TanStack Query para datos del servidor.
- Utilizar Zustand solo para estado global.
- Componentes pequeños y reutilizables.
- No superar 250 líneas por archivo (salvo excepciones justificadas).

---

## Backend

- Toda lógica de negocio debe vivir en Services.
- Los Controllers solo reciben requests y devuelven responses.
- Los Repositories son la única capa que accede a la base de datos.
- Utilizar DTOs para todas las entradas.
- Documentar todos los endpoints con Swagger.

---

## Base de Datos

- Todos los IDs serán UUID.
- Todas las tablas tendrán `created_at` y `updated_at`.
- No eliminar registros importantes físicamente cuando exista una alternativa de desactivación (`active`).

---

## Git

- Commits pequeños y descriptivos.
- Una funcionalidad por rama.
- No mezclar refactors con nuevas funcionalidades.
