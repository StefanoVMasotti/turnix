import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useSchedules, useCreateSchedule, useDeleteSchedule } from "../../hooks/useSchedules";
import { useEmployees } from "../../hooks/useEmployees";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Spinner } from "../../components/ui/Spinner";

const days = [
  { value: "0", label: "Domingo" },
  { value: "1", label: "Lunes" },
  { value: "2", label: "Martes" },
  { value: "3", label: "Miércoles" },
  { value: "4", label: "Jueves" },
  { value: "5", label: "Viernes" },
  { value: "6", label: "Sábado" }
];

export function SchedulesPage() {
  const { data: schedules, isLoading } = useSchedules();
  const { data: employees } = useEmployees();
  const createSchedule = useCreateSchedule();
  const deleteSchedule = useDeleteSchedule();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterEmployeeId, setFilterEmployeeId] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    employeeId: "",
    dayOfWeek: "1",
    startTime: "09:00",
    endTime: "17:00"
  });

  function getEmployeeName(id: string) {
    const emp = employees?.find((e) => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : id;
  }

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    createSchedule.mutate({
      ...formData,
      dayOfWeek: Number(formData.dayOfWeek),
      startTime: formData.startTime + ":00",
      endTime: formData.endTime + ":00"
    }, {
      onSuccess: () => { setIsModalOpen(false); },
    });
  }

  function handleDelete(id: string) {
    setDeleteId(id);
  }

  function confirmDelete() {
    if (!deleteId) return;
    deleteSchedule.mutate(deleteId, {
      onSettled: () => { setDeleteId(null); }
    });
  }

  if (isLoading) return <div className="flex flex-col items-center gap-3 py-16"><Spinner /><p className="text-slate-400 text-sm">Cargando horarios...</p></div>;

  const filteredSchedules = filterEmployeeId
    ? schedules?.filter((s) => s.employeeId === filterEmployeeId)
    : schedules;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Horarios</h1>
        <Button onClick={() => { setIsModalOpen(true); }}>
          <Plus size={16} className="mr-2" />
          Nuevo Horario
        </Button>
      </div>

      <div className="mb-4">
        <Select
          label="Filtrar por empleado"
          value={filterEmployeeId}
          onChange={(e) => { setFilterEmployeeId(e.target.value); }}
          options={employees?.map((e) => ({ value: e.id, label: `${e.firstName} ${e.lastName}` })) ?? []}
          placeholder="Todos los empleados"
        />
      </div>

      <div className="space-y-3">
        {filteredSchedules?.map((schedule) => (
          <Card key={schedule.id} className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-100 truncate">
                {getEmployeeName(schedule.employeeId)}
              </p>
              <p className="text-sm text-slate-400 truncate">
                {days.find((d) => d.value === String(schedule.dayOfWeek))?.label} · {schedule.startTime} - {schedule.endTime}
              </p>
            </div>
            <Button variant="danger" size="sm" onClick={() => { handleDelete(schedule.id); }}>
              <Trash2 size={14} />
            </Button>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); }}
        title="Nuevo Horario"
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
          <Select
            label="Día"
            value={formData.dayOfWeek}
            onChange={(e) => { setFormData({ ...formData, dayOfWeek: e.target.value }); }}
            options={days}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400">Hora inicio</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => { setFormData({ ...formData, startTime: e.target.value }); }}
                className="bg-surface border border-border rounded-[10px] px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400">Hora fin</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => { setFormData({ ...formData, endTime: e.target.value }); }}
                className="bg-surface border border-border rounded-[10px] px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => { setIsModalOpen(false); }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createSchedule.isPending}>
              Crear
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => { if (!deleteSchedule.isPending) setDeleteId(null); }}
        onConfirm={confirmDelete}
        title="Eliminar horario"
        description="¿Seguro que querés eliminar este horario? El empleado ya no estará disponible en ese día y franja."
        confirmLabel="Sí, eliminar"
        variant="danger"
        loading={deleteSchedule.isPending}
      />
    </div>
  );
}
