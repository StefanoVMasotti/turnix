import { useState } from "react";
import { Plus, Pencil, CheckCircle, XCircle } from "lucide-react";
import { useAppointments, useCreateAppointment, useUpdateAppointment } from "../../hooks/useAppointments";
import { useServices } from "../../hooks/useServices";
import { useEmployees } from "../../hooks/useEmployees";
import { useClients } from "../../hooks/useClients";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import type { Appointment } from "../../types/appointment";

const STATUS_LABELS: Record<string, string> = {
  scheduled: "Programado",
  completed: "Completado",
  cancelled: "Cancelado",
  no_show: "No asistió"
};

const STATUS_VARIANTS: Record<string, "success" | "danger" | "warning" | "info"> = {
  scheduled: "info",
  completed: "success",
  cancelled: "danger",
  no_show: "warning"
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = String(d.getUTCFullYear());
  return `${day}/${month}/${year}`;
}

function formatTime(timeStr: string) {
  const t = timeStr.split("T")[1];
  return t ? t.substring(0, 5) : timeStr;
}

function toLocalDateStr(isoStr: string) {
  const d = new Date(isoStr);
  const y = String(d.getUTCFullYear());
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function AppointmentsPage() {
  const { data: appointments, isLoading } = useAppointments();
  const { data: services } = useServices();
  const { data: employees } = useEmployees();
  const { data: clients } = useClients();
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [error, setError] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [formData, setFormData] = useState({
    clientId: "",
    employeeId: "",
    serviceId: "",
    appointmentDate: "",
    startTime: "",
    endTime: "",
    notes: ""
  });

  function openCreateModal() {
    setEditing(null);
    setFormData({ clientId: "", employeeId: "", serviceId: "", appointmentDate: "", startTime: "", endTime: "", notes: "" });
    setIsModalOpen(true);
  }

  function openEditModal(apt: Appointment) {
    setEditing(apt);
    setFormData({
      clientId: apt.clientId,
      employeeId: apt.employeeId,
      serviceId: apt.serviceId,
      appointmentDate: toLocalDateStr(apt.appointmentDate),
      startTime: formatTime(apt.startTime),
      endTime: formatTime(apt.endTime),
      notes: apt.notes ?? ""
    });
    setIsModalOpen(true);
  }

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setError("");

    const payload = {
      ...formData,
      startTime: formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime,
      endTime: formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime
    };

    if (editing) {
      updateAppointment.mutate({ id: editing.id, data: payload }, {
        onSuccess: () => { setIsModalOpen(false); },
        onError: () => { setError("Error al actualizar el turno"); }
      });
    } else {
      createAppointment.mutate(payload, {
        onSuccess: () => { setIsModalOpen(false); },
        onError: () => { setError("Error al crear el turno"); }
      });
    }
  }

  function handleStatusChange(id: string, status: "completed" | "cancelled" | "no_show") {
    const labels: Record<string, string> = { completed: "completado", cancelled: "cancelado", no_show: "no asistió" };
    if (!confirm(`¿Marcar turno como ${labels[status]}?`)) return;
    updateAppointment.mutate({ id, data: { status } });
  }

  const filtered = appointments?.filter((apt) => {
    if (filterDate && toLocalDateStr(apt.appointmentDate) !== filterDate) return false;
    if (filterStatus && apt.status !== filterStatus) return false;
    return true;
  });

  if (isLoading) return <p className="text-slate-400">Cargando turnos...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Turnos</h1>
        <Button onClick={openCreateModal}>
          <Plus size={16} className="mr-2" />
          Nuevo Turno
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <Input
          label="Fecha"
          type="date"
          value={filterDate}
          onChange={(e) => { setFilterDate(e.target.value); }}
        />
        <div className="flex flex-col">
          <label className="text-xs font-medium text-slate-400 mb-1">Estado</label>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); }}
            className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">Todos</option>
            <option value="scheduled">Programado</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
            <option value="no_show">No asistió</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered?.length === 0 && (
          <p className="text-slate-500 text-sm">No hay turnos para los filtros seleccionados.</p>
        )}
        {filtered?.map((apt) => (
          <Card key={apt.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="text-sm text-slate-400 w-24 shrink-0">
                  {formatDate(apt.appointmentDate)}
                </div>
                <div className="text-sm font-medium text-slate-100 w-28 shrink-0">
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
              <div className="flex gap-2 ml-4 shrink-0">
                <Button variant="secondary" size="sm" onClick={() => { openEditModal(apt); }}>
                  <Pencil size={14} />
                </Button>
                {apt.status === "scheduled" && (
                  <>
                    <Button variant="primary" size="sm" onClick={() => { handleStatusChange(apt.id, "completed"); }} disabled={updateAppointment.isPending} title="Marcar completado">
                      <CheckCircle size={14} />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => { handleStatusChange(apt.id, "cancelled"); }} disabled={updateAppointment.isPending} title="Cancelar turno">
                      <XCircle size={14} />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setError(""); }}
        title={editing ? "Editar Turno" : "Nuevo Turno"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-400 mb-1">Cliente</label>
            <select
              value={formData.clientId}
              onChange={(e) => { setFormData({ ...formData, clientId: e.target.value }); }}
              required
              className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Seleccionar cliente</option>
              {clients?.map((c) => (
                <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-400 mb-1">Empleado</label>
            <select
              value={formData.employeeId}
              onChange={(e) => { setFormData({ ...formData, employeeId: e.target.value }); }}
              required
              className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Seleccionar empleado</option>
              {employees?.filter((emp) => emp.active).map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-400 mb-1">Servicio</label>
            <select
              value={formData.serviceId}
              onChange={(e) => { setFormData({ ...formData, serviceId: e.target.value }); }}
              required
              className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Seleccionar servicio</option>
              {services?.filter((s) => s.active).map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.durationMinutes} min)</option>
              ))}
            </select>
          </div>
          <Input
            label="Fecha"
            type="date"
            value={formData.appointmentDate}
            onChange={(e) => { setFormData({ ...formData, appointmentDate: e.target.value }); }}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Hora inicio"
              type="time"
              value={formData.startTime}
              onChange={(e) => { setFormData({ ...formData, startTime: e.target.value }); }}
              required
            />
            <Input
              label="Hora fin"
              type="time"
              value={formData.endTime}
              onChange={(e) => { setFormData({ ...formData, endTime: e.target.value }); }}
              required
            />
          </div>
          <Input
            label="Notas"
            value={formData.notes}
            onChange={(e) => { setFormData({ ...formData, notes: e.target.value }); }}
          />
          {error && <p className="text-sm text-error">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => { setIsModalOpen(false); setError(""); }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createAppointment.isPending || updateAppointment.isPending}>
              {editing ? "Guardar" : "Crear"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
