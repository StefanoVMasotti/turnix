import { createBrowserRouter, Navigate } from "react-router-dom";
import { App } from "../App";
import { AdminLayout } from "../layouts/AdminLayout";
import { PublicLayout } from "../layouts/PublicLayout";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { LoginPage } from "../pages/auth/LoginPage";
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
import { PublicBookingPage } from "../pages/public/PublicBookingPage";

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
            element: <Navigate to="/turnix-demo" replace />
          },
          {
            path: ":slug",
            element: <PublicBookingPage />
          }
        ]
      },
      {
        path: "/login",
        element: <LoginPage />
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        ),
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
