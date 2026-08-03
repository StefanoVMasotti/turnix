# Arquitectura Frontend

## Introducción

El frontend de Turnix será desarrollado utilizando React, TypeScript y Vite.

La aplicación seguirá una arquitectura basada en componentes reutilizables, buscando mantener una clara separación de responsabilidades y facilitar el mantenimiento del código.

---

# Stack

- React
- TypeScript
- Vite
- React Router DOM
- Tailwind CSS
- TanStack Query
- Zustand
- Axios
- React Hook Form
- Zod

---

# Estructura del proyecto

```text
src/
│
├── assets/
├── components/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
├── store/
├── styles/
├── types/
├── utils/
├── App.tsx
└── main.tsx
```

---

# assets/

Contendrá todos los recursos estáticos.

Ejemplos:

- imágenes
- iconos
- logos
- fuentes

---

# components/

Componentes reutilizables.

Ejemplos:

Button

Input

Card

Modal

Navbar

Sidebar

Calendar

ProfessionalCard

ServiceCard

AppointmentSummary

TimeSlot

Cada componente debe tener una única responsabilidad.

---

# hooks/

Hooks personalizados.

Ejemplos:

useAuth

useAppointments

useEmployees

useServices

---

# layouts/

Layouts generales.

Inicialmente existirán dos.

PublicLayout

AdminLayout

El objetivo es evitar repetir Navbar, Sidebar y Footer.

---

# pages/

Representan las páginas del sistema.

Ejemplo:

Home

Services

Professionals

Schedule

Confirmation

Login

Dashboard

Employees

ServicesAdmin

AppointmentsAdmin

Settings

Las páginas únicamente organizan componentes.

No contienen lógica de negocio.

---

# routes/

Configuración de React Router.

Separación entre rutas públicas y privadas.

---

# services/

Comunicación con la API.

Se utilizará Axios.

Ejemplo:

auth.service.ts

employee.service.ts

appointment.service.ts

service.service.ts

Nunca realizar llamadas HTTP directamente desde los componentes.

---

# store/

Estado global.

Se utilizará Zustand.

Ejemplos:

Usuario autenticado

Configuraciones

Tema

---

# styles/

Estilos globales.

Tailwind será el principal sistema de estilos.

Aquí solo existirán configuraciones globales.

---

# types/

Interfaces y tipos.

Ejemplo:

Appointment.ts

Employee.ts

Service.ts

Business.ts

Client.ts

---

# utils/

Funciones auxiliares.

Ejemplo:

formatDate()

formatPrice()

calculateDuration()

groupAppointments()

---

# Convenciones

Cada componente tendrá su propia carpeta.

Ejemplo:

components/

Button/

Button.tsx

Button.types.ts

index.ts

No se crearán componentes de cientos de líneas.

Se priorizarán componentes pequeños y reutilizables.

---

# Filosofía

El frontend será una Single Page Application (SPA).

Toda la información será obtenida desde la API del backend.

El frontend nunca accederá directamente a la base de datos.

Toda la lógica de negocio residirá en el backend.
