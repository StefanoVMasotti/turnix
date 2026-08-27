# Fase 3 - Autenticación

## Estado: COMPLETADO ✓

## Resumen

Implementación del sistema de autenticación para el panel administrativo de Turnix.

- **Proveedor:** Supabase Auth
- **Modelo:** 1 usuario = 1 negocio (businessId desde JWT)
- **Roles:** owner / admin
- **Registro:** Solo login (usuarios creados por seed o panel admin)

---

## Arquitectura

```
Frontend                              Backend
─────────                             ────────
LoginPage
  ↓
Supabase Auth (signInWithPassword)
  ↓
JWT token (Supabase firma)
  ↓
authStore (Zustand + localStorage)
  ↓
api.ts: Authorization: Bearer <jwt> → JwtGuard (verifica JWT + setea request.user)
                                      ↓
                                      @Roles(owner/admin) ← RolesGuard
                                      ↓
                                      Controller → Service → Repository
                                      (usa request.user.businessId para filtrar)
```

### Seguridad multi-tenant

- El `businessId` sale **siempre** del JWT, nunca del header.
- El header `x-business-id` se **elimina** completamente.
- Cada usuario pertenece a un único negocio.
- `JwtGuard` verifica el token y setea `request.user` con `{ id, authUserId, role, businessId }`.
- `RolesGuard` valida que el usuario tenga el rol requerido.

---

## Subplane 1: Backend Auth Core ✓ COMPLETADO

**Objetivo:** Crear la infraestructura de autenticación en el backend.

### Tareas

| # | Tarea | Archivos |
|---|-------|----------|
| 1 | Instalar `@supabase/supabase-js` | `package.json` |
| 2 | Crear SupabaseService | `src/common/services/supabase.service.ts` |
| 3 | Crear decorador @Roles | `src/common/decorators/roles.decorator.ts` |
| 4 | Crear decorador @CurrentUser | `src/common/decorators/current-user.decorator.ts` |
| 5 | Crear JwtGuard | `src/common/guards/jwt.guard.ts` |
| 6 | Crear RolesGuard | `src/common/guards/roles.guard.ts` |
| 7 | Crear AuthModule + Controller + Service + DTO | `src/modules/auth/*` (5 archivos) |

### Dependencias

Ninguna (arranca de cero).

### Validación

- El backend compila sin errores.
- Los guards están testeables unitariamente.
- Swagger muestra los endpoints de auth (`POST /auth/login`, `POST /auth/logout`, `GET /auth/profile`).

---

## Subplane 2: Backend Integration ✓ COMPLETADO

**Objetivo:** Integrar auth en los controllers existentes y limpiar el BusinessContextGuard.

### Tareas

| # | Tarea | Archivos |
|---|-------|----------|
| 8 | Eliminar BusinessContextGuard | `src/common/guards/business-context.guard.ts` |
| 9 | Actualizar todos los controllers admin con nuevos guards | `src/modules/*/src/*.controller.ts` (9 controllers) |
| 10 | Crear UsersModule | `src/modules/users/*` (5 archivos) |
| 11 | Registrar módulos en AppModule | `src/app.module.ts` |
| 12 | Actualizar seed con usuario owner | `prisma/seed.js` |

### Dependencias

Subplane 1 completado.

### Validación

- Login funciona contra Supabase.
- Endpoints admin rechazan requests sin token (401).
- Roles se respetan (admin no puede crear usuarios, solo owner).

---

## Subplane 3: Frontend Auth ✓ COMPLETADO

**Objetivo:** Crear toda la experiencia de login y protección de rutas en el frontend.

### Tareas

| # | Tarea | Archivos |
|---|-------|----------|
| 13 | Instalar `@supabase/supabase-js` | `package.json` |
| 14 | Crear tipos de auth | `src/types/auth.ts` |
| 15 | Crear authStore (Zustand) | `src/store/auth.store.ts` |
| 16 | Crear cliente Supabase | `src/services/supabase.ts` |
| 17 | Actualizar api.ts (Bearer + 401) | `src/services/api.ts` |
| 18 | Crear ProtectedRoute | `src/components/auth/ProtectedRoute.tsx` |
| 19 | Crear LoginPage | `src/pages/auth/LoginPage.tsx` |
| 20 | Actualizar router | `src/routes/router.tsx` |
| 21 | Actualizar AdminLayout | `src/layouts/AdminLayout.tsx` |
| 22 | Crear useAuth hook | `src/hooks/useAuth.ts` |
| 23 | Agregar env vars frontend | `.env.example`, `vite-env.d.ts` |
| 24 | Actualizar business.store (eliminar hardcode) | `src/store/business.store.ts` |

### Dependencias

Subplane 2 completado (backend funcional para probar login).

### Validación

- Login muestra pantalla de login.
- Al loguear redirige a `/admin`.
- Al cerrar sesión vuelve a `/login`.
- Rutas admin protegidas (sin auth → redirect a /login).
- AdminLayout muestra nombre de usuario, badge de rol y botón de logout.

---

## Subplane 4: Documentación + Final ✓ COMPLETADO

**Objetivo:** Actualizar toda la documentación y verificar que todo esté consistente.

### Tareas

| # | Tarea | Archivos |
|---|-------|----------|
| 25 | Actualizar decisions.md | `docs/decisions/decisions.md` |
| 26 | Actualizar roadmap.md | `docs/roadmap/roadmap.md` |
| 27 | Actualizar endpoints.md | `docs/api/endpoints.md` |
| 28 | Actualizar project-context.md | `docs/project-context.md` |

### Dependencias

Subplanes 1-3 completados.

### Validación

- Toda la documentación refleja el estado real del sistema.
- Roadmap muestra Fase 3 como completada.
- Endpoints reflejan los endpoints de auth implementados.

---

## Flujo de ejecución

```
Subplane 1 ──→ Subplane 2 ──→ Subplane 3 ──→ Subplane 4
 Backend         Backend         Frontend        Docs
 Auth Core       Integration     Auth            Final
 (7 tareas)      (5 tareas)      (12 tareas)     (4 tareas)
```

---

## Archivos a crear (nuevos)

| Archivo | Descripción |
|---------|-------------|
| `backend/src/common/services/supabase.service.ts` | Cliente Supabase singleton |
| `backend/src/common/guards/jwt.guard.ts` | Guard JWT Supabase |
| `backend/src/common/guards/roles.guard.ts` | Guard de roles |
| `backend/src/common/decorators/roles.decorator.ts` | Decorador @Roles |
| `backend/src/common/decorators/current-user.decorator.ts` | Decorador @CurrentUser |
| `backend/src/modules/auth/auth.module.ts` | Módulo de auth |
| `backend/src/modules/auth/auth.controller.ts` | Controller de auth |
| `backend/src/modules/auth/auth.service.ts` | Service de auth |
| `backend/src/modules/auth/dto/login.dto.ts` | DTO de login |
| `backend/src/modules/users/users.module.ts` | Módulo de usuarios |
| `backend/src/modules/users/users.controller.ts` | Controller de usuarios |
| `backend/src/modules/users/users.service.ts` | Service de usuarios |
| `backend/src/modules/users/users.repository.ts` | Repository de usuarios |
| `backend/src/modules/users/dto/create-user.dto.ts` | DTO de creación |
| `frontend/src/types/auth.ts` | Tipos de autenticación |
| `frontend/src/store/auth.store.ts` | Store de autenticación |
| `frontend/src/services/supabase.ts` | Cliente Supabase |
| `frontend/src/components/auth/ProtectedRoute.tsx` | Wrapper rutas protegidas |
| `frontend/src/pages/auth/LoginPage.tsx` | Página de login |
| `frontend/src/hooks/useAuth.ts` | Hook de autenticación |

## Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `backend/package.json` | Instalar @supabase/supabase-js |
| `backend/src/app.module.ts` | Agregar AuthModule, UsersModule |
| `backend/src/common/guards/business-context.guard.ts` | **Eliminar** |
| `backend/src/modules/*/src/*.controller.ts` | Reemplazar guards |
| `backend/prisma/seed.js` | Agregar usuario owner |
| `backend/.env.example` | Agregar SUPABASE_URL, SUPABASE_ANON_KEY |
| `frontend/package.json` | Instalar @supabase/supabase-js |
| `frontend/src/services/api.ts` | Interceptor Authorization + 401 |
| `frontend/src/routes/router.tsx` | Rutas protegidas + login |
| `frontend/src/layouts/AdminLayout.tsx` | User info + logout |
| `frontend/src/store/business.store.ts` | Eliminar hardcode |
| `frontend/.env.example` | Variables Supabase |
| `frontend/vite-env.d.ts` | Declarar tipos de env vars |
| `docs/decisions/decisions.md` | Documentar auth |
| `docs/roadmap/roadmap.md` | Marcar fase 3 |
| `docs/api/endpoints.md` | Auth endpoints |
| `docs/project-context.md` | Mencionar auth |
