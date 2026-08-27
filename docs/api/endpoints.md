# API

> La API usa el prefijo global `/api`. Los endpoints del panel administrativo requieren el header `Authorization: Bearer <token>`. Los endpoints públicos se identifican por el `slug` del negocio y no requieren autenticación.

## Auth

POST /auth/login

- Recibe `email` + `password`.
- Retorna `{ access_token, user }`.

POST /auth/logout

- Requiere autenticación.

GET /auth/profile

- Requiere autenticación.
- Retorna datos del usuario autenticado.

---

## Public (Reserva Pública)

Endpoints sin autenticación, identifican al negocio por `slug`.

GET /public/:slug

- Datos de la landing del negocio: datos del negocio, settings, servicios activos con sus profesionales y precios.

GET /public/:slug/availability?serviceId=&employeeId=&date=

- Sin `date`: devuelve los días del booking window con cantidad de turnos libres (`{ days: [{ date, available, slotsCount }] }`). Alimenta el calendario.
- Con `date=YYYY-MM-DD`: devuelve los horarios disponibles de ese día (`{ date, slots: [{ startTime, endTime }] }`).
- `employeeId` es opcional: si se omite, se agrega la disponibilidad de todos los profesionales que ofrecen el servicio.

POST /public/:slug/appointments

- Crea un turno desde la reserva pública (`bookingSource: "web"`, `status: "scheduled"`).
- Realiza find-or-create del cliente por teléfono.
- Devuelve 409 si el horario ya no está disponible.

---

## Businesses

GET /business

PUT /business

GET /business/settings

PUT /business/settings

---

## Employees

GET /employees

GET /employees/:id

POST /employees

PUT /employees/:id

DELETE /employees/:id

PATCH /employees/:id/toggle-active

---

## Services

GET /services

POST /services

PUT /services/:id

DELETE /services/:id

PATCH /services/:id/toggle-active

---

## Employee Services

GET /employee-services

POST /employee-services

PUT /employee-services/:id

PATCH /employee-services/:id/toggle-active

DELETE /employee-services/:id

---

## Schedules

GET /schedules

POST /schedules

PUT /schedules/:id

DELETE /schedules/:id

---

## Time Off

GET /time-off

POST /time-off

PUT /time-off/:id (pendiente)

DELETE /time-off/:id

---

## Blocks

GET /blocks

POST /blocks

PUT /blocks/:id (pendiente)

DELETE /blocks/:id

---

## Clients

GET /clients

GET /clients/:id

POST /clients

PUT /clients/:id

---

## Appointments

GET /appointments

GET /appointments/:id

POST /appointments

PUT /appointments/:id

DELETE /appointments/:id

---

## Users

GET /users

- Requiere rol `owner`.

GET /users/:id

- Requiere rol `owner`.

POST /users

- Requiere rol `owner`.
- Recibe `authUserId`, `name`, `email`, `role`, `businessId`.

DELETE /users/:id

- Requiere rol `owner`.
- Soft delete (desactiva el usuario).
