import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Wrench, Users, UserCog, Link2, Calendar, CalendarDays, Clock, Ban, Settings, ChevronLeft, ChevronRight, Menu, LogOut } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!sidebarOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSidebarOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-background text-slate-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => { setSidebarOpen(false); }}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-40 w-60 transform bg-surface border-r border-border flex flex-col transition-transform duration-300
        md:relative md:translate-x-0 md:transition-all md:duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${collapsed ? "md:w-16" : "md:w-60"}
      `}>
        <div className="flex items-center justify-between px-4 py-5 border-b border-border">
          {!collapsed && (
            <span className="font-semibold text-sm">Turnix Admin</span>
          )}
          <button
            onClick={() => { setCollapsed(!collapsed); }}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-card hidden md:block"
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

        {user && (
          <div className="border-t border-border p-3">
            {!collapsed ? (
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                </div>
                <button
                  onClick={logout}
                  className="text-slate-400 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-card"
                  title="Cerrar sesión"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={logout}
                className="w-full flex items-center justify-center text-slate-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-card"
                title="Cerrar sesión"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        )}
      </aside>

      <main className="flex-1 overflow-auto min-w-0">
        <div className="px-4 py-4 md:px-8 md:py-6">
          <div className="flex items-center gap-3 mb-4 md:hidden">
            <button
              onClick={() => { setSidebarOpen(true); }}
              className="text-slate-400 hover:text-slate-200 transition-colors p-2 rounded-lg hover:bg-card"
            >
              <Menu size={20} />
            </button>
            <span className="font-semibold text-sm">Turnix Admin</span>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
