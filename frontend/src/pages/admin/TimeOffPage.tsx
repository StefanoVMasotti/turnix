import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useTimeOff, useCreateTimeOff, useDeleteTimeOff } from "../../hooks/useTimeOff";
import { useEmployees } from "../../hooks/useEmployees";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function TimeOffPage() {
  const { data: timeOff, isLoading } = useTimeOff();
  const { data: employees } = useEmployees();
  const createTimeOff = useCreateTimeOff();
  const deleteTimeOff = useDeleteTimeOff();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    employeeId: "",
    startDate: "",
    endDate: "",
    reason: ""
  });

  function getEmployeeName(id: string) {
    const emp = employees?.find((e) => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : id;
  }

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setError("");
    createTimeOff.mutate(formData, {
      onSuccess: () => { setIsModalOpen(false); },
      onError: () => { setError("Error al crear el permiso"); }
    });
  }

  function handleDelete(id: string) {
    if (confirm("¿Eliminar este permiso?")) {
      deleteTimeOff.mutate(id);
    }
  }

  if (isLoading) return <p className="text-slate-400">Cargando permisos...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Permisos (Time Off)</h1>
        <Button onClick={() => { setIsModalOpen(true); }}>
          <Plus size={16} className="mr-2" />
          Nuevo Permiso
        </Button>
      </div>

      <div className="space-y-3">
        {timeOff?.map((item) => (
          <Card key={item.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-100">
                {getEmployeeName(item.employeeId)}
              </p>
              <p className="text-sm text-slate-400">
                {formatDate(item.startDate)} - {formatDate(item.endDate)}{item.reason ? ` · ${item.reason}` : ""}
              </p>
            </div>
            <Button variant="danger" size="sm" onClick={() => { handleDelete(item.id); }}>
              <Trash2 size={14} />
            </Button>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setError(""); }}
        title="Nuevo Permiso"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Empleado"
            value={formData.employeeId}
            onChange={(e) => { setFormData({ ...formData, employeeId: e.target.value }); }}
            options={employees?.map((e) => ({ value: e.id, label: `${e.firstName} ${e.lastName}` })) ?? []}
            placeholder="Seleccionar empleado"
            required
          />
          <Input
            label="Fecha inicio"
            type="date"
            value={formData.startDate}
            onChange={(e) => { setFormData({ ...formData, startDate: e.target.value }); }}
            required
          />
          <Input
            label="Fecha fin"
            type="date"
            value={formData.endDate}
            onChange={(e) => { setFormData({ ...formData, endDate: e.target.value }); }}
            required
          />
          <Input
            label="Razón"
            value={formData.reason}
            onChange={(e) => { setFormData({ ...formData, reason: e.target.value }); }}
          />
          {error && <p className="text-sm text-error">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => { setIsModalOpen(false); setError(""); }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createTimeOff.isPending}>
              Crear
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
