import { useState, useEffect } from "react";
import { useBusiness, useUpdateBusiness, useBusinessSettings, useUpdateBusinessSettings } from "../../hooks/useBusiness";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Spinner } from "../../components/ui/Spinner";

export function BusinessSettingsPage() {
  const { data: business, isLoading: isLoadingBusiness } = useBusiness();
  const { data: settings, isLoading: isLoadingSettings } = useBusinessSettings();
  const updateBusiness = useUpdateBusiness();
  const updateSettings = useUpdateBusinessSettings();

  const [businessForm, setBusinessForm] = useState({
    name: "",
    slug: "",
    phone: "",
    email: "",
    address: ""
  });

  const [settingsForm, setSettingsForm] = useState({
    bufferMinutes: 0,
    maxBookingDays: 30,
    timezone: "America/Buenos_Aires",
    currency: "ARS"
  });
  const [businessMessage, setBusinessMessage] = useState("");
  const [settingsMessage, setSettingsMessage] = useState("");

  useEffect(() => {
    if (business) {
      setBusinessForm({
        name: business.name,
        slug: business.slug,
        phone: business.phone ?? "",
        email: business.email ?? "",
        address: business.address ?? ""
      });
    }
  }, [business]);

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        bufferMinutes: settings.bufferMinutes,
        maxBookingDays: settings.maxBookingDays,
        timezone: settings.timezone,
        currency: settings.currency
      });
    }
  }, [settings]);

  function handleBusinessSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setBusinessMessage("");
    updateBusiness.mutate(businessForm, {
      onSuccess: () => { setBusinessMessage("Guardado correctamente"); },
      onError: () => { setBusinessMessage("Error al guardar"); }
    });
  }

  function handleSettingsSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setSettingsMessage("");
    updateSettings.mutate(settingsForm, {
      onSuccess: () => { setSettingsMessage("Guardado correctamente"); },
      onError: () => { setSettingsMessage("Error al guardar"); }
    });
  }

  if (isLoadingBusiness || isLoadingSettings) {
    return <div className="flex flex-col items-center gap-3 py-16"><Spinner /><p className="text-slate-400 text-sm">Cargando configuración...</p></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Configuración del Negocio</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Datos del Negocio">
          <form onSubmit={handleBusinessSubmit} className="space-y-4">
            <Input
              label="Nombre"
              value={businessForm.name}
              onChange={(e) => { setBusinessForm({ ...businessForm, name: e.target.value }); }}
              required
            />
            <Input
              label="Teléfono"
              value={businessForm.phone}
              onChange={(e) => { setBusinessForm({ ...businessForm, phone: e.target.value }); }}
            />
            <Input
              label="Slug (URL pública)"
              value={businessForm.slug}
              onChange={(e) => { setBusinessForm({ ...businessForm, slug: e.target.value }); }}
            />
            <Input
              label="Email"
              type="email"
              value={businessForm.email}
              onChange={(e) => { setBusinessForm({ ...businessForm, email: e.target.value }); }}
            />
            <Input
              label="Dirección"
              value={businessForm.address}
              onChange={(e) => { setBusinessForm({ ...businessForm, address: e.target.value }); }}
            />
            {businessMessage && <p className={`text-sm ${businessMessage.includes("Error") ? "text-error" : "text-success"}`}>{businessMessage}</p>}
            <div className="flex justify-end">
              <Button type="submit" disabled={updateBusiness.isPending}>
                Guardar
              </Button>
            </div>
          </form>
        </Card>

        <Card title="Configuración de Citas">
          <form onSubmit={handleSettingsSubmit} className="space-y-4">
            <Input
              label="Pausa entre turnos (min)"
              type="number"
              value={settingsForm.bufferMinutes}
              onChange={(e) => { setSettingsForm({ ...settingsForm, bufferMinutes: Number(e.target.value) }); }}
            />
            <Input
              label="Máximo días de anticipación"
              type="number"
              value={settingsForm.maxBookingDays}
              onChange={(e) => { setSettingsForm({ ...settingsForm, maxBookingDays: Number(e.target.value) }); }}
            />
            <Input
              label="Zona horaria"
              value={settingsForm.timezone}
              onChange={(e) => { setSettingsForm({ ...settingsForm, timezone: e.target.value }); }}
            />
            <Input
              label="Moneda"
              value={settingsForm.currency}
              onChange={(e) => { setSettingsForm({ ...settingsForm, currency: e.target.value }); }}
            />
            {settingsMessage && <p className={`text-sm ${settingsMessage.includes("Error") ? "text-error" : "text-success"}`}>{settingsMessage}</p>}
            <div className="flex justify-end">
              <Button type="submit" disabled={updateSettings.isPending}>
                Guardar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
