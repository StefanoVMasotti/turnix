import { useState } from "react";
import { Plus, Pencil, History } from "lucide-react";
import { useClients, useCreateClient, useUpdateClient } from "../../hooks/useClients";
import { useAppointments } from "../../hooks/useAppointments";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { Spinner } from "../../components/ui/Spinner";
import type { Client } from "../../types/client";

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
  return timeStr.substring(0, 5);
}

export function ClientsPage() {
  const { data: clients, isLoading } = useClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [error, setError] = useState("");
  const [historyClientId, setHistoryClientId] = useState<string | null>(null);
  const { data: historyAppointments, isLoading: historyLoading } = useAppointments(historyClientId ?? undefined);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: ""
  });

  function openCreateModal() {
    setEditingClient(null);
    setFormData({ firstName: "", lastName: "", email: "", phone: "", notes: "" });
    setIsModalOpen(true);
  }

  function openEditModal(client: Client) {
    setEditingClient(client);
    setFormData({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email ?? "",
      phone: client.phone,
      notes: client.notes ?? ""
    });
    setIsModalOpen(true);
  }

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setError("");
    if (editingClient) {
      updateClient.mutate({ id: editingClient.id, data: formData }, {
        onSuccess: () => { setIsModalOpen(false); },
        onError: () => { setError("Error al actualizar el cliente"); }
      });
    } else {
      createClient.mutate(formData, {
        onSuccess: () => { setIsModalOpen(false); },
        onError: () => { setError("Error al crear el cliente"); }
      });
    }
  }

  if (isLoading) return <div className="flex flex-col items-center gap-3 py-16"><Spinner /><p className="text-slate-400 text-sm">Cargando clientes...</p></div>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button onClick={openCreateModal}>
          <Plus size={16} className="mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients?.map((client) => (
          <Card key={client.id}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-slate-100">{client.firstName} {client.lastName}</h3>
            </div>
            {client.email && (
              <p className="text-sm text-slate-400 mb-1">{client.email}</p>
            )}
            {client.phone && (
              <p className="text-sm text-slate-400 mb-4">{client.phone}</p>
            )}
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => { openEditModal(client); }}>
                <Pencil size={14} />
              </Button>
              <Button variant="secondary" size="sm" onClick={() => { setHistoryClientId(client.id); }} title="Ver historial">
                <History size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setError(""); }}
        title={editingClient ? "Editar Cliente" : "Nuevo Cliente"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre"
            value={formData.firstName}
            onChange={(e) => { setFormData({ ...formData, firstName: e.target.value }); }}
            required
          />
          <Input
            label="Apellido"
            value={formData.lastName}
            onChange={(e) => { setFormData({ ...formData, lastName: e.target.value }); }}
            required
          />
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => { setFormData({ ...formData, email: e.target.value }); }}
          />
          <Input
            label="Teléfono"
            value={formData.phone}
            onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); }}
          />
          {error && <p className="text-sm text-error">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => { setIsModalOpen(false); setError(""); }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createClient.isPending || updateClient.isPending}>
              {editingClient ? "Guardar" : "Crear"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={historyClientId !== null}
        onClose={() => { setHistoryClientId(null); }}
        title="Historial de turnos"
      >
        {historyLoading ? (
          <p className="text-slate-400 text-sm">Cargando historial...</p>
        ) : historyAppointments && historyAppointments.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {historyAppointments.map((apt) => (
              <div key={apt.id} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                <div className="text-sm text-slate-400 shrink-0">
                  {formatDate(apt.appointmentDate)}
                </div>
                <div className="text-sm font-medium text-slate-100 shrink-0">
                  {formatTime(apt.startTime)}
                </div>
                <div className="text-sm text-slate-200 truncate flex-1">
                  {apt.service?.name ?? "—"}
                </div>
                <Badge variant={STATUS_VARIANTS[apt.status] ?? "info"}>
                  {STATUS_LABELS[apt.status] ?? apt.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">Este cliente no tiene turnos registrados.</p>
        )}
      </Modal>
    </div>
  );
}
