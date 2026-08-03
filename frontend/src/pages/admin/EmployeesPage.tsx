import { useState } from "react";
import { Plus, Pencil, Power } from "lucide-react";
import { useEmployees, useCreateEmployee, useUpdateEmployee, useToggleEmployeeActive } from "../../hooks/useEmployees";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import type { Employee } from "../../types/employee";

export function EmployeesPage() {
  const { data: employees, isLoading } = useEmployees();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const toggleActive = useToggleEmployeeActive();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  function openCreateModal() {
    setEditingEmployee(null);
    setFormData({ firstName: "", lastName: "", email: "", phone: "" });
    setIsModalOpen(true);
  }

  function openEditModal(employee: Employee) {
    setEditingEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email ?? "",
      phone: employee.phone ?? ""
    });
    setIsModalOpen(true);
  }

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setError("");
    if (editingEmployee) {
      updateEmployee.mutate({ id: editingEmployee.id, data: formData }, {
        onSuccess: () => { setIsModalOpen(false); },
        onError: () => { setError("Error al actualizar el empleado"); }
      });
    } else {
      createEmployee.mutate(formData, {
        onSuccess: () => { setIsModalOpen(false); },
        onError: () => { setError("Error al crear el empleado"); }
      });
    }
  }

  function handleToggleActive(id: string) {
    toggleActive.mutate(id);
  }

  if (isLoading) return <p className="text-slate-400">Cargando empleados...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Empleados</h1>
        <Button onClick={openCreateModal}>
          <Plus size={16} className="mr-2" />
          Nuevo Empleado
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {employees?.map((employee) => (
          <Card key={employee.id} className={!employee.active ? "opacity-50" : ""}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-slate-100">{employee.firstName} {employee.lastName}</h3>
              <Badge variant={employee.active ? "success" : "danger"}>
                {employee.active ? "Activo" : "Inactivo"}
              </Badge>
            </div>
            {employee.email && (
              <p className="text-sm text-slate-400 mb-1">{employee.email}</p>
            )}
            {employee.phone && (
              <p className="text-sm text-slate-400 mb-4">{employee.phone}</p>
            )}
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => { openEditModal(employee); }}>
                <Pencil size={14} />
              </Button>
              <Button
                variant={employee.active ? "danger" : "primary"}
                size="sm"
                onClick={() => { handleToggleActive(employee.id); }}
                disabled={toggleActive.isPending}
              >
                <Power size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setError(""); }}
        title={editingEmployee ? "Editar Empleado" : "Nuevo Empleado"}
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
            <Button type="submit" disabled={createEmployee.isPending || updateEmployee.isPending}>
              {editingEmployee ? "Guardar" : "Crear"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
