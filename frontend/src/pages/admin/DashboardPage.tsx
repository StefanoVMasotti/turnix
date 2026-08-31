import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, CheckCircle2, XCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getHealth } from "../../services/health.service";
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

function toLocalDateStr(date: Date) {
  const y = String(date.getFullYear());
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toLocalDateStrFromUTC(dateStr: string) {
  return dateStr.substring(0, 10);
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
  const { data: appointments } = useAppointments();

  const now = new Date();
  const todayStr = toLocalDateStr(now);

  const todayAppointments = appointments?.filter(
    (a) => toLocalDateStrFromUTC(a.appointmentDate) === todayStr
  ) ?? [];

  const todayStats = {
    total: todayAppointments.length,
    scheduled: todayAppointments.filter((a) => a.status === "scheduled").length,
    completed: todayAppointments.filter((a) => a.status === "completed").length,
    cancelled: todayAppointments.filter((a) => a.status === "cancelled" || a.status === "no_show").length,
  };

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = toLocalDateStr(d);
    const dayLabel = d.toLocaleDateString("es-ES", { weekday: "short", day: "numeric" });
    const dayAppointments = appointments?.filter(
      (a) => toLocalDateStrFromUTC(a.appointmentDate) === dateStr
    ) ?? [];
    return {
      day: dayLabel,
      completados: dayAppointments.filter((a) => a.status === "completed").length,
      cancelados: dayAppointments.filter((a) => a.status === "cancelled" || a.status === "no_show").length,
      programados: dayAppointments.filter((a) => a.status === "scheduled").length,
    };
  });

  const upcoming = appointments
    ?.filter((a) => a.status === "scheduled" && toLocalDateStrFromUTC(a.appointmentDate) >= todayStr)
    .sort((a, b) => a.appointmentDate.localeCompare(b.appointmentDate) || a.startTime.localeCompare(b.startTime))
    .slice(0, 5);

  const statCards = [
    { label: "Turnos hoy", value: todayStats.total, icon: CalendarDays, color: "text-blue-400" },
    { label: "Pendientes", value: todayStats.scheduled, icon: Clock, color: "text-yellow-400" },
    { label: "Completados", value: todayStats.completed, icon: CheckCircle2, color: "text-green-400" },
    { label: "Cancelados", value: todayStats.cancelled, icon: XCircle, color: "text-red-400" },
  ];

  return (
    <div>
      <p className="text-sm font-medium text-primary">Panel administrativo</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-50">Dashboard</h1>

      <div className="grid gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <s.icon size={20} className={s.color} />
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
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Turnos de los últimos 7 días</h2>
        <Card>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                  labelStyle={{ color: "#e2e8f0" }}
                  itemStyle={{ color: "#cbd5e1" }}
                />
                <Bar dataKey="completados" name="Completados" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="programados" name="Programados" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cancelados" name="Cancelados" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Próximos turnos</h2>
        {upcoming && upcoming.length === 0 && (
          <p className="text-slate-500 text-sm">No hay turnos programados.</p>
        )}
        <div className="space-y-3">
          {upcoming?.map((apt) => (
            <Card key={apt.id}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                <div className="flex items-center justify-between gap-3 sm:contents">
                  <div className="text-sm text-slate-400 w-14 shrink-0">
                    {formatDate(apt.appointmentDate)}
                  </div>
                  <div className="text-sm font-medium text-slate-100 w-24 shrink-0">
                    {formatTime(apt.startTime)} - {formatTime(apt.endTime)}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm text-slate-200 truncate">
                    {apt.client ? `${apt.client.firstName} ${apt.client.lastName}` : "—"}
                  </div>
                  <Badge variant={STATUS_VARIANTS[apt.status] ?? "info"}>
                    {STATUS_LABELS[apt.status] ?? apt.status}
                  </Badge>
                </div>
                <div className="text-sm text-slate-400 truncate hidden sm:block">
                  {apt.service?.name ?? "—"}
                </div>
                <div className="text-sm text-slate-400 truncate hidden md:block">
                  {apt.employee ? `${apt.employee.firstName} ${apt.employee.lastName}` : "—"}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
