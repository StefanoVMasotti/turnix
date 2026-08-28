import { useState } from "react";
import { Pencil, Plus, Power } from "lucide-react";
import { useEmployeeServices, useCreateEmployeeService, useUpdateEmployeeService, useToggleEmployeeServiceActive } from "../../hooks/useEmployeeServices";
import { useEmployees } from "../../hooks/useEmployees";
import { useServices } from "../../hooks/useServices";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Spinner } from "../../components/ui/Spinner";
import type { EmployeeService } from "../../types/employee-service";

export function EmployeeServicesPage() {
  const { data: assignments, isLoading } = useEmployeeServices();
  const { data: employees } = useEmployees();
  const { data: services } = useServices();
  const createAssignment = useCreateEmployeeService();
  const updateAssignment = useUpdateEmployeeService();
  const toggleActive = useToggleEmployeeServiceActive();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<EmployeeService | null>(null);
  const [toggleId, setToggleId] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [price, setPrice] = useState(0);

  function resetForm() {
    setEditingAssignment(null);
    setEmployeeId("");
    setServiceId("");
    setPrice(0);
  }

  function openCreateModal() {
    resetForm();
    setIsModalOpen(true);
  }

  function openEditModal(assignment: EmployeeService) {
    setEditingAssignment(assignment);
    setEmployeeId(assignment.employeeId);
    setServiceId(assignment.serviceId);
    setPrice(assignment.price);
    setIsModalOpen(true);
  }

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (editingAssignment) {
      updateAssignment.mutate(
        { id: editingAssignment.id, data: { price } },
        {
          onSuccess: () => { setIsModalOpen(false); resetForm(); },
        }
      );
      return;
    }
    createAssignment.mutate({ employeeId, serviceId, price }, {
      onSuccess: () => { setIsModalOpen(false); resetForm(); },
    });
  }

  if (isLoading) return <div className="flex flex-col items-center gap-3 py-16"><Spinner /><p className="text-slate-400 text-sm">Cargando asignaciones...</p></div>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Servicios por Empleado</h1>
        <Button onClick={openCreateModal}>
          <Plus size={16} className="mr-2" />
          Nueva Asignación
        </Button>
      </div>

      <div className="space-y-3">
        {assignments?.length === 0 && (
          <p className="text-slate-500 text-sm">No hay asignaciones registradas.</p>
        )}
        {assignments?.map((a) => (
          <Card key={a.id} className={!a.active ? "opacity-50" : ""}>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-100">
                    {a.employee ? `${a.employee.firstName} ${a.employee.lastName}` : "—"}
                  </span>
                  <Badge variant={a.active ? "success" : "danger"}>
                    {a.active ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  Servicio: <span className="text-slate-200">{a.service?.name ?? "—"}</span>
                  <span className="text-xs text-slate-500 ml-2">
                    ({a.service?.durationMinutes ?? "?"} min{a.price ? ` · $${String(a.price)}` : ""})
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => { openEditModal(a); }}>
                  <Pencil size={14} />
                </Button>
                <Button
                  variant={a.active ? "danger" : "primary"}
                  size="sm"
                onClick={() => { setToggleId(a.id); }}
                disabled={toggleActive.isPending}
                >
                  <Power size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        isOpen={toggleId !== null}
        onClose={() => { if (!toggleActive.isPending) setToggleId(null); }}
        onConfirm={() => {
          if (!toggleId) return;
          toggleActive.mutate(toggleId, {
            onSettled: () => { setToggleId(null); }
          });
        }}
        title={toggleId && assignments?.find((a) => a.id === toggleId)?.active ? "Desactivar asignación" : "Activar asignación"}
        description={toggleId && assignments?.find((a) => a.id === toggleId)?.active
          ? "¿Seguro que querés desactivar esta asignación? El empleado no podrá ofrecer este servicio."
          : "¿Seguro que querés activar esta asignación? El empleado volverá a ofrecer este servicio."}
        confirmLabel={toggleId && assignments?.find((a) => a.id === toggleId)?.active ? "Sí, desactivar" : "Sí, activar"}
        variant={toggleId && assignments?.find((a) => a.id === toggleId)?.active ? "danger" : "primary"}
        loading={toggleActive.isPending}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title={editingAssignment ? "Editar Precio" : "Asignar Servicio a Empleado"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingAssignment && (
            <>
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
            </>
          )}
          <Input
            label="Precio para este empleado"
            type="number"
            value={price}
            onChange={(e) => { setPrice(Number(e.target.value)); }}
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => { setIsModalOpen(false); resetForm(); }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createAssignment.isPending || updateAssignment.isPending}>
              {editingAssignment ? "Guardar" : "Asignar"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
