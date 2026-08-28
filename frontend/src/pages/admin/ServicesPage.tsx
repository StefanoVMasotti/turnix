import { useState } from "react";
import { Plus, Pencil, Power } from "lucide-react";
import { useServices, useCreateService, useUpdateService, useToggleServiceActive } from "../../hooks/useServices";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Spinner } from "../../components/ui/Spinner";
import type { Service } from "../../types/service";

export function ServicesPage() {
  const { data: services, isLoading } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const toggleActive = useToggleServiceActive();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [toggleId, setToggleId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    durationMinutes: 30
  });

  function openCreateModal() {
    setEditingService(null);
    setFormData({ name: "", description: "", durationMinutes: 30 });
    setIsModalOpen(true);
  }

  function openEditModal(service: Service) {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description ?? "",
      durationMinutes: service.durationMinutes
    });
    setIsModalOpen(true);
  }

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    if (editingService) {
      updateService.mutate({ id: editingService.id, data: formData }, {
        onSuccess: () => { setIsModalOpen(false); },
      });
    } else {
      createService.mutate(formData, {
        onSuccess: () => { setIsModalOpen(false); },
      });
    }
  }

  function handleToggleActive(id: string) {
    setToggleId(id);
  }

  function confirmToggle() {
    if (!toggleId) return;
    toggleActive.mutate(toggleId, {
      onSettled: () => { setToggleId(null); }
    });
  }

  if (isLoading) return <div className="flex flex-col items-center gap-3 py-16"><Spinner /><p className="text-slate-400 text-sm">Cargando servicios...</p></div>;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Servicios</h1>
        <Button onClick={openCreateModal}>
          <Plus size={16} className="mr-2" />
          Nuevo Servicio
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services?.map((service) => (
          <Card key={service.id} className={!service.active ? "opacity-50" : ""}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-slate-100">{service.name}</h3>
              <Badge variant={service.active ? "success" : "danger"}>
                {service.active ? "Activo" : "Inactivo"}
              </Badge>
            </div>
            {service.description && (
              <p className="text-sm text-slate-400 mb-3">{service.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-slate-300 mb-4">
              <span>{service.durationMinutes} min</span>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => { openEditModal(service); }}>
                <Pencil size={14} />
              </Button>
              <Button
                variant={service.active ? "danger" : "primary"}
                size="sm"
                onClick={() => { handleToggleActive(service.id); }}
                disabled={toggleActive.isPending}
              >
                <Power size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        isOpen={toggleId !== null}
        onClose={() => { if (!toggleActive.isPending) setToggleId(null); }}
        onConfirm={confirmToggle}
        title={toggleId && services?.find((s) => s.id === toggleId)?.active ? "Desactivar servicio" : "Activar servicio"}
        description={toggleId && services?.find((s) => s.id === toggleId)?.active
          ? "¿Seguro que querés desactivar este servicio? Los clientes no podrán reservarlo."
          : "¿Seguro que querés activar este servicio? Volverá a estar disponible para reservas."}
        confirmLabel={toggleId && services?.find((s) => s.id === toggleId)?.active ? "Sí, desactivar" : "Sí, activar"}
        variant={toggleId && services?.find((s) => s.id === toggleId)?.active ? "danger" : "primary"}
        loading={toggleActive.isPending}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); }}
        title={editingService ? "Editar Servicio" : "Nuevo Servicio"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre"
            value={formData.name}
            onChange={(e) => { setFormData({ ...formData, name: e.target.value }); }}
            required
          />
          <Input
            label="Descripción"
            value={formData.description}
            onChange={(e) => { setFormData({ ...formData, description: e.target.value }); }}
          />
          <Input
            label="Duración (min)"
            type="number"
            value={formData.durationMinutes}
            onChange={(e) => { setFormData({ ...formData, durationMinutes: Number(e.target.value) }); }}
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => { setIsModalOpen(false); }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createService.isPending || updateService.isPending}>
              {editingService ? "Guardar" : "Crear"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
