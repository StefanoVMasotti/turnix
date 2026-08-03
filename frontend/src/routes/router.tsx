import { createBrowserRouter } from "react-router-dom";
import { App } from "../App";
import { AdminLayout } from "../layouts/AdminLayout";
import { PublicLayout } from "../layouts/PublicLayout";
import { DashboardPage } from "../pages/admin/DashboardPage";
import { ServicesPage } from "../pages/admin/ServicesPage";
import { EmployeesPage } from "../pages/admin/EmployeesPage";
import { ClientsPage } from "../pages/admin/ClientsPage";
import { SchedulesPage } from "../pages/admin/SchedulesPage";
import { TimeOffPage } from "../pages/admin/TimeOffPage";
import { AppointmentsPage } from "../pages/admin/AppointmentsPage";
import { EmployeeServicesPage } from "../pages/admin/EmployeeServicesPage";
import { BlocksPage } from "../pages/admin/BlocksPage";
import { BusinessSettingsPage } from "../pages/admin/BusinessSettingsPage";
import { BookingHomePage } from "../pages/public/BookingHomePage";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <PublicLayout />,
        children: [
          {
            index: true,
            element: <BookingHomePage />
          }
        ]
      },
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />
          },
          {
            path: "services",
            element: <ServicesPage />
          },
          {
            path: "employees",
            element: <EmployeesPage />
          },
          {
            path: "employee-services",
            element: <EmployeeServicesPage />
          },
          {
            path: "clients",
            element: <ClientsPage />
          },
          {
            path: "schedules",
            element: <SchedulesPage />
          },
          {
            path: "time-off",
            element: <TimeOffPage />
          },
          {
            path: "appointments",
            element: <AppointmentsPage />
          },
          {
            path: "blocks",
            element: <BlocksPage />
          },
          {
            path: "settings",
            element: <BusinessSettingsPage />
          }
        ]
      }
    ]
  }
]);
