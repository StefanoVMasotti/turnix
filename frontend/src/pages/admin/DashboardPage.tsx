import { useQuery } from "@tanstack/react-query";
import { Users, UserCog, Wrench, CalendarDays } from "lucide-react";
import { getHealth } from "../../services/health.service";
import { useClients } from "../../hooks/useClients";
import { useEmployees } from "../../hooks/useEmployees";
import { useServices } from "../../hooks/useServices";
import { useAppointments } from "../../hooks/useAppointments";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

function formatTime(timeStr: string) {
  return timeStr.substring(0, 5);
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
}

const STATUS_VARIANTS: Record<string, "success" | "danger" | "warning" | "info"> = {
  scheduled: "info",
  completed: "success",
  cancelled: "danger",
  no_show: "warning"
};

const STATUS_LABELS: Record<string, string> = {
  scheduled: "Programado",
  completed: "Completado",
  cancelled: "Cancelado",
  no_show: "No asistió"
};

export function DashboardPage() {
  useQuery({ queryKey: ["health"], queryFn: getHealth, retry: false });
  const { data: clients } = useClients();
  const { data: employees } = useEmployees();
  const { data: services } = useServices();
  const { data: appointments } = useAppointments();

  const now = new Date();
  const todayStr = `${String(now.getUTCFullYear())}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}`;

  const upcoming = appointments
    ?.filter((a) => a.status === "scheduled" && a.appointmentDate.substring(0, 10) >= todayStr)
    .sort((a, b) => a.appointmentDate.localeCompare(b.appointmentDate) || a.startTime.localeCompare(b.startTime))
    .slice(0, 5);

  const todayCount = appointments?.filter(
    (a) => a.appointmentDate.substring(0, 10) === todayStr && a.status === "scheduled"
  ).length ?? 0;

  const stats = [
    { label: "Clientes", value: clients?.length ?? 0, icon: UserCog },
    { label: "Empleados", value: employees?.filter((e) => e.active).length ?? 0, icon: Users },
    { label: "Servicios", value: services?.filter((s) => s.active).length ?? 0, icon: Wrench },
    { label: "Turnos hoy", value: todayCount, icon: CalendarDays }
  ];

  return (
    <div>
      <p className="text-sm font-medium text-primary">Panel administrativo</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-50">Dashboard</h1>

      <div className="grid gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <s.icon size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-100">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Próximos turnos</h2>
        {upcoming && upcoming.length === 0 && (
          <p className="text-slate-500 text-sm">No hay turnos programados.</p>
        )}
        <div className="space-y-3">
          {upcoming?.map((apt) => (
            <Card key={apt.id}>
              <div className="flex items-center gap-4">
                <div className="text-sm text-slate-400 w-14 shrink-0">
                  {formatDate(apt.appointmentDate)}
                </div>
                <div className="text-sm font-medium text-slate-100 w-24 shrink-0">
                  {formatTime(apt.startTime)} - {formatTime(apt.endTime)}
                </div>
                <div className="text-sm text-slate-200 truncate">
                  {apt.client ? `${apt.client.firstName} ${apt.client.lastName}` : "—"}
                </div>
                <div className="text-sm text-slate-400 truncate hidden sm:block">
                  {apt.service?.name ?? "—"}
                </div>
                <div className="text-sm text-slate-400 truncate hidden md:block">
                  {apt.employee ? `${apt.employee.firstName} ${apt.employee.lastName}` : "—"}
                </div>
                <Badge variant={STATUS_VARIANTS[apt.status] ?? "info"}>
                  {STATUS_LABELS[apt.status] ?? apt.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
