import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Wrench, Users, UserCog, Link2, Calendar, CalendarDays, Clock, Ban, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/services", label: "Servicios", icon: Wrench },
  { path: "/admin/employees", label: "Empleados", icon: Users },
  { path: "/admin/employee-services", label: "Servicios-Empleados", icon: Link2 },
  { path: "/admin/clients", label: "Clientes", icon: UserCog },
  { path: "/admin/appointments", label: "Turnos", icon: CalendarDays },
  { path: "/admin/schedules", label: "Horarios", icon: Calendar },
  { path: "/admin/time-off", label: "Permisos", icon: Clock },
  { path: "/admin/blocks", label: "Bloqueos", icon: Ban },
  { path: "/admin/settings", label: "Configuración", icon: Settings }
];

export function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-slate-50">
      <aside className={`${collapsed ? "w-16" : "w-60"} transition-all duration-300 border-r border-border bg-surface flex flex-col`}>
        <div className="flex items-center justify-between px-4 py-5 border-b border-border">
          {!collapsed && (
            <span className="font-semibold text-sm">Turnix Admin</span>
          )}
          <button
            onClick={() => { setCollapsed(!collapsed); }}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-card"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        <nav className="flex-1 py-3 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "text-slate-400 hover:text-slate-200 hover:bg-card"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon size={18} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
