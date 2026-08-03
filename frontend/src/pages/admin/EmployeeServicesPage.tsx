import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useEmployeeServices, useCreateEmployeeService, useDeleteEmployeeService } from "../../hooks/useEmployeeServices";
import { useEmployees } from "../../hooks/useEmployees";
import { useServices } from "../../hooks/useServices";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";

export function EmployeeServicesPage() {
  const { data: assignments, isLoading } = useEmployeeServices();
  const { data: employees } = useEmployees();
  const { data: services } = useServices();
  const createAssignment = useCreateEmployeeService();
  const deleteAssignment = useDeleteEmployeeService();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [price, setPrice] = useState(0);

  function resetForm() {
    setEmployeeId("");
    setServiceId("");
    setPrice(0);
    setError("");
  }

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setError("");
    createAssignment.mutate({ employeeId, serviceId, price }, {
      onSuccess: () => { setIsModalOpen(false); resetForm(); },
      onError: () => { setError("Error al asignar servicio. Puede que ya exista esta asignación."); }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta asignación?")) return;
    deleteAssignment.mutate(id);
  }

  if (isLoading) return <p className="text-slate-400">Cargando asignaciones...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Servicios por Empleado</h1>
        <Button onClick={() => { setIsModalOpen(true); }}>
          <Plus size={16} className="mr-2" />
          Nueva Asignación
        </Button>
      </div>

      <div className="space-y-3">
        {assignments?.length === 0 && (
          <p className="text-slate-500 text-sm">No hay asignaciones registradas.</p>
        )}
        {assignments?.map((a) => (
          <Card key={a.id}>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-100">
                  {a.employee ? `${a.employee.firstName} ${a.employee.lastName}` : "—"}
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  Servicio: <span className="text-slate-200">{a.service?.name ?? "—"}</span>
                  <span className="text-xs text-slate-500 ml-2">
                    ({a.service?.durationMinutes ?? "?"} min{a.price ? ` · $${String(a.price)}` : ""})
                  </span>
                </div>
              </div>
              <Button variant="danger" size="sm" onClick={() => { handleDelete(a.id); }} disabled={deleteAssignment.isPending}>
                <Trash2 size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title="Asignar Servicio a Empleado"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-slate-400 mb-1">Empleado</label>
            <select
              value={employeeId}
              onChange={(e) => { setEmployeeId(e.target.value); }}
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
              value={serviceId}
              onChange={(e) => { setServiceId(e.target.value); }}
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
            label="Precio para este empleado"
            type="number"
            value={price}
            onChange={(e) => { setPrice(Number(e.target.value)); }}
            required
          />
          {error && <p className="text-sm text-error">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => { setIsModalOpen(false); resetForm(); }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createAssignment.isPending}>
              Asignar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
