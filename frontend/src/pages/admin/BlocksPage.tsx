import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useBlocks, useCreateBlock, useDeleteBlock } from "../../hooks/useBlocks";
import { useEmployees } from "../../hooks/useEmployees";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Spinner } from "../../components/ui/Spinner";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function BlocksPage() {
  const { data: blocks, isLoading } = useBlocks();
  const { data: employees } = useEmployees();
  const createBlock = useCreateBlock();
  const deleteBlock = useDeleteBlock();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    employeeId: "",
    blockDate: "",
    startTime: "09:00",
    endTime: "17:00",
    reason: ""
  });

  function getEmployeeName(id: string) {
    const emp = employees?.find((e) => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : id;
  }

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    createBlock.mutate({
      ...formData,
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
    deleteBlock.mutate(deleteId, {
      onSettled: () => { setDeleteId(null); }
    });
  }

  if (isLoading) return <div className="flex flex-col items-center gap-3 py-16"><Spinner /><p className="text-slate-400 text-sm">Cargando bloqueos...</p></div>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Bloqueos</h1>
        <Button onClick={() => { setIsModalOpen(true); }}>
          <Plus size={16} className="mr-2" />
          Nuevo Bloqueo
        </Button>
      </div>

      <div className="space-y-3">
        {blocks?.map((block) => (
          <Card key={block.id} className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-100 truncate">
                {getEmployeeName(block.employeeId)}
              </p>
              <p className="text-sm text-slate-400 truncate">
                {formatDate(block.blockDate)} · {block.startTime} - {block.endTime}
                {block.reason ? ` · ${block.reason}` : ""}
              </p>
            </div>
            <Button variant="danger" size="sm" onClick={() => { handleDelete(block.id); }}>
              <Trash2 size={14} />
            </Button>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); }}
        title="Nuevo Bloqueo"
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
            label="Fecha"
            type="date"
            value={formData.blockDate}
            onChange={(e) => { setFormData({ ...formData, blockDate: e.target.value }); }}
            required
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
          <Input
            label="Razón"
            value={formData.reason}
            onChange={(e) => { setFormData({ ...formData, reason: e.target.value }); }}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => { setIsModalOpen(false); }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createBlock.isPending}>
              Crear
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => { if (!deleteBlock.isPending) setDeleteId(null); }}
        onConfirm={confirmDelete}
        title="Eliminar bloqueo"
        description="¿Seguro que querés eliminar este bloqueo? El empleado volverá a estar disponible en ese horario."
        confirmLabel="Sí, eliminar"
        variant="danger"
        loading={deleteBlock.isPending}
      />
    </div>
  );
}
