# Base de Datos

## Introducción

Turnix utiliza PostgreSQL como motor de base de datos, alojado en Supabase.

El modelo fue diseñado siguiendo principios de normalización y preparado para soportar múltiples negocios (Multi-Tenant) desde la primera versión.

La disponibilidad de turnos no se almacena en la base de datos; se calcula dinámicamente a partir de los horarios de trabajo, bloqueos, ausencias y turnos existentes.

---

# Modelo Relacional

## Entidades principales

- Businesses
- Business Settings
- Users
- Employees
- Services
- Employee Services
- Employee Schedules
- Employee Time Off
- Employee Blocks
- Clients
- Appointments

---

# Businesses

Representa cada negocio registrado en la plataforma.

## Campos

- id (UUID)
- name
- slug
- phone
- email
- address
- active
- created_at
- updated_at

## slug

Identificador único, legible y SEO-friendly que se usa en la URL pública del negocio (`/:slug`).

Se genera automáticamente a partir del nombre y puede editarse desde el panel administrativo.

Debe ser único por negocio.

## Relaciones

Business

├── Users

├── Business Settings

├── Employees

├── Services

├── Clients

└── Appointments

---

# Business Settings

Configuración operativa de cada negocio.

## Campos

- id
- business_id
- timezone
- currency
- appointment_interval
- max_booking_days
- created_at
- updated_at

## Relaciones

Cada Business tiene una configuración asociada.

---

# Users

Usuarios con acceso al panel administrativo.

## Campos

- id
- business_id
- auth_user_id
- name
- email
- role
- active
- created_at
- updated_at

## Roles

- owner
- admin

Versiones futuras:

- employee
- receptionist

---

# Employees

Profesionales que prestan servicios.

## Campos

- id
- business_id
- first_name
- last_name
- phone
- email
- active
- created_at
- updated_at

## Relaciones

Employee

├── Employee Services

├── Employee Schedules

├── Employee Time Off

├── Employee Blocks

└── Appointments

---

# Services

Servicios ofrecidos por un negocio.

## Campos

- id
- business_id
- name
- description
- duration_minutes
- active
- created_at
- updated_at

El precio no pertenece al servicio: se define por profesional en `Employee Services`.

---

# Employee Services

Tabla intermedia que representa la relación muchos a muchos entre empleados y servicios.

## Campos

- id
- employee_id
- service_id
- price
- active
- created_at
- updated_at

## price

Precio del servicio para ese profesional específico.

Un mismo servicio puede tener precios distintos según el profesional.

---

# Employee Schedules

Horario habitual de cada empleado.

## Campos

- id
- employee_id
- day_of_week
- start_time
- end_time
- created_at
- updated_at

## day_of_week

0 Domingo

1 Lunes

2 Martes

3 Miércoles

4 Jueves

5 Viernes

6 Sábado

---

# Employee Time Off

Ausencias completas.

Ejemplos:

- Vacaciones
- Licencias
- Enfermedad

## Campos

- id
- employee_id
- start_date
- end_date
- reason
- created_at
- updated_at

---

# Employee Blocks

Bloqueos parciales del día.

Ejemplos:

- Almuerzo
- Capacitación
- Reunión
- Descanso

## Campos

- id
- employee_id
- block_date
- start_time
- end_time
- reason
- created_at
- updated_at

---

# Clients

Clientes que reservan turnos.

No requieren autenticación.

## Campos

- id
- business_id
- first_name
- last_name
- phone
- email
- notes
- created_at
- updated_at

---

# Appointments

Representa cada turno reservado.

## Campos

- id
- business_id
- client_id
- employee_id
- service_id
- appointment_date
- start_time
- end_time
- status
- booking_source
- notes
- created_at
- updated_at

## Estados

- scheduled
- completed
- cancelled
- no_show

## Booking Source

- web
- whatsapp
- phone
- walk_in

---

# Horarios y timezone

## Estrategia (v1)

Los horarios se almacenan como **hora local del negocio** (wall-clock naive), sin conversión de zona horaria:

- Las columnas `TIME` guardan el horario de la franja tal cual lo ve el negocio.
- Las columnas `DATE` guardan el día calendario del negocio.
- El campo `BusinessSettings.timezone` es la fuente de verdad del huso del negocio.

El backend recibe y devuelve los horarios como strings (`HH:mm:ss`) y construye los `Date` con el formato `1970-01-01T{HH:mm:ss}Z` para preservar el wall-clock. El frontend formatea la porción de hora con helpers UTC (`getUTCHours`, etc.).

Para calcular el "hoy" del negocio y filtrar horarios pasados se usa `Intl.DateTimeFormat` con `timezone`, de modo que la lógica no depende de la zona horaria del servidor.

## Migración futura a UTC

El diseño deja preparada una futura migración:

- `BusinessSettings.timezone` ya es la fuente de verdad.
- Toda la manipulación de fechas está centralizada en utilidades del backend (`src/common/utils/time.ts`) y del frontend (`src/utils/date.ts`).
- Una versión futura podrá migrar a almacenamiento UTC y convertir en el frontend sin tocar la lógica de negocio.

---

# Reglas del Negocio

## Disponibilidad

Los horarios disponibles nunca se almacenan.

Siempre se calculan dinámicamente.

Para calcular disponibilidad el sistema consulta:

1. Horario habitual del empleado.
2. Ausencias.
3. Bloqueos.
4. Turnos existentes (estado `scheduled`).
5. Que el profesional ofrezca el servicio activo (`Employee Services`).

Se genera una grilla de candidatos desde la apertura del empleado avanzando en `BusinessSettings.appointment_interval`, cada turno con duración igual a la del servicio. Se descartan los candidatos que:

- Superen el cierre del horario habitual.
- Se solapen con bloqueos o turnos existentes.
- Sean pasados (si la fecha es hoy, se usa `BusinessSettings.timezone`).
- Queden fuera de la ventana de reserva (`BusinessSettings.max_booking_days`).

---

## Clientes

Los clientes no necesitan crear una cuenta.

El sistema únicamente almacenará la información necesaria para la reserva.

---

## Empleados

Un empleado puede realizar múltiples servicios.

Un servicio puede ser realizado por múltiples empleados.

---

## Multiempresa

Toda entidad principal pertenece a un Business.

Esto permite que múltiples negocios utilicen la plataforma sin compartir información.

---

# Restricciones

## UNIQUE

Users.email

Employee Services

(employee_id, service_id)

---

## CHECK

Appointments.status

Appointments.booking_source

EmployeeSchedules.day_of_week

---

# Índices recomendados

Appointments

(employee_id, appointment_date)

Clients

(phone)

Employees

(business_id)

Services

(business_id)

---

# Convenciones

## Identificadores

Todos los registros utilizarán UUID.

---

## Fechas

Todos los registros tendrán:

created_at

updated_at

---

## Soft Delete

En la primera versión no se implementará Soft Delete.

Los registros importantes utilizarán el campo active cuando corresponda.

---

# Filosofía

El modelo de datos fue diseñado para minimizar redundancias y permitir la incorporación de nuevas funcionalidades sin modificar la estructura principal.

Las futuras versiones podrán incorporar pagos, notificaciones, automatizaciones y múltiples sucursales reutilizando este mismo esquema.
