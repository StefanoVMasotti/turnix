import { useState } from "react";
import { ArrowLeft, CheckCircle, ChevronLeft } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Spinner } from "../../components/ui/Spinner";
import { ServiceCard } from "../../components/booking/ServiceCard";
import { ProfessionalCard } from "../../components/booking/ProfessionalCard";
import { Calendar } from "../../components/booking/Calendar";
import { TimeSlot as TimeSlotButton } from "../../components/booking/TimeSlot";
import { AppointmentSummary } from "../../components/booking/AppointmentSummary";
import {
  useAvailabilityDays,
  useAvailabilitySlots,
  useCreatePublicAppointment,
  usePublicLanding,
} from "../../hooks/usePublicBooking";
import type { PublicAppointment, TimeSlot } from "../../types/public";
import { formatDate, formatTime, weekdayLabel } from "../../utils/date";

export function PublicBookingPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: landing, isLoading } = usePublicLanding(slug);
  const createAppointment = useCreatePublicAppointment(slug);

  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState<TimeSlot | null>(null);
  const [created, setCreated] = useState<PublicAppointment | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [formError, setFormError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const currency = landing?.settings.currency ?? "ARS";
  const service = landing?.services.find((s) => s.id === serviceId) ?? null;
  const employee =
    service?.employees.find((e) => e.employeeId === employeeId) ?? null;

  const { data: days, isLoading: daysLoading } = useAvailabilityDays(
    slug,
    serviceId,
    employeeId,
  );
  const { data: slots, isFetching: slotsLoading } = useAvailabilitySlots(
    slug,
    serviceId,
    date,
    employeeId,
  );

  function selectService(id: string) {
    setServiceId(id);
    setEmployeeId("");
    setDate("");
    setSlot(null);
    setStep(2);
  }

  function selectEmployee(id: string) {
    setEmployeeId(id);
    setDate("");
    setSlot(null);
    setStep(3);
  }

  function selectDate(nextDate: string) {
    setDate(nextDate);
    setSlot(null);
    setStep(4);
  }

  function back() {
    setSubmitError("");
    setShowConfirm(false);
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === 4) setStep(3);
    else if (step === 5) setStep(4);
    else setStep(1);
  }

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    setFormError("");
    setSubmitError("");

    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim()) {
      setFormError("Completá nombre, apellido y teléfono.");
      return;
    }

    if (!service || !employee || !slot) return;

    setShowConfirm(true);
  }

  function confirmBooking() {
    if (!service || !employee || !slot) return;

    createAppointment.mutate(
      {
        serviceId: service.id,
        employeeId: employee.employeeId,
        appointmentDate: date,
        startTime: slot.startTime,
        client: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
        },
      },
      {
        onSuccess: (appointment) => {
          setShowConfirm(false);
          setCreated(appointment);
          setStep(6);
        },
        onError: (error) => {
          const status = (error as { response?: { status?: number } }).response
            ?.status;
          setSubmitError(
            status === 409
              ? "Ese horario ya no está disponible. Volvé y elegí otro."
              : "No se pudo confirmar la reserva. Intentalo de nuevo.",
          );
        },
      },
    );
  }

  if (isLoading) {
    return (
      <p className="mx-auto max-w-6xl px-6 py-16 text-slate-400">Cargando...</p>
    );
  }

  if (!landing) {
    return (
      <p className="mx-auto max-w-6xl px-6 py-16 text-slate-400">
        El negocio no existe o no está disponible.
      </p>
    );
  }

  if (step === 6 && created) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center">
          <CheckCircle aria-hidden="true" className="h-12 w-12 text-success" />
          <h1 className="mt-4 text-2xl font-bold text-slate-50">
            ¡Turno confirmado!
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {created.service?.name} con {created.employee?.firstName}{" "}
            {created.employee?.lastName}
          </p>
          <p className="mt-1 text-sm text-slate-300">
            {weekdayLabel(created.appointmentDate)}{" "}
            {formatDate(created.appointmentDate)} a las{" "}
            {formatTime(created.startTime)}
          </p>
          <p className="mt-4 text-xs text-slate-500">
            Código: {created.id.slice(0, 8)}
          </p>
          <Link to={`/${slug}`} className="mt-6">
            <Button
              variant="secondary"
              onClick={() => {
                window.location.reload();
              }}
            >
              Nueva reserva
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-50">
          {landing.business.name}
        </h1>
        {landing.business.address && (
          <p className="mt-1 text-sm text-slate-400">
            {landing.business.address}
          </p>
        )}
      </div>

      <div className="mb-6 flex items-center gap-3">
        {step > 1 && step < 6 && (
          <button
            onClick={back}
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200"
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            Volver
          </button>
        )}
        <span className="text-xs font-medium text-slate-500">
          Paso {step} de 5
        </span>
      </div>

      {step === 1 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-100">
            Elegí un servicio
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {landing.services.map((s) => (
              <ServiceCard
                key={s.id}
                service={s}
                currency={currency}
                selected={s.id === serviceId}
                onSelect={() => {
                  selectService(s.id);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {step === 2 && service && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-100">
            Elegí un profesional
          </h2>
          {service.employees.length === 0 ? (
            <p className="text-sm text-slate-500">
              Este servicio no tiene profesionales disponibles por el momento.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {service.employees.map((emp) => (
                <ProfessionalCard
                  key={emp.employeeId}
                  employee={emp}
                  currency={currency}
                  selected={emp.employeeId === employeeId}
                  onSelect={() => {
                    selectEmployee(emp.employeeId);
                  }}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {step === 3 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-100">
            Elegí un día
          </h2>
          <Calendar
            days={days ?? []}
            selectedDate={date}
            onSelect={selectDate}
            isLoading={daysLoading}
          />
        </section>
      )}

      {step === 4 && (
        <section>
          <h2 className="mb-1 text-lg font-semibold text-slate-100">
            Elegí un horario
          </h2>
          {date && (
            <p className="mb-4 text-sm text-slate-400">
              {weekdayLabel(date)}, {formatDate(date)}
            </p>
          )}
          {slotsLoading && <Spinner className="py-8" />}
          {!slotsLoading && (slots?.length ?? 0) === 0 && (
            <p className="text-sm text-slate-500">
              No hay horarios disponibles ese día.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {slots?.map((s) => (
              <TimeSlotButton
                key={s.startTime}
                slot={s}
                selected={slot?.startTime === s.startTime}
                onSelect={() => {
                  setSlot(s);
                  setStep(5);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {step === 5 && service && employee && slot && (
        <section className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-semibold text-slate-100">
              Tus datos
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre"
                value={form.firstName}
                onChange={(e) => {
                  setForm({ ...form, firstName: e.target.value });
                }}
                required
              />
              <Input
                label="Apellido"
                value={form.lastName}
                onChange={(e) => {
                  setForm({ ...form, lastName: e.target.value });
                }}
                required
              />
              <Input
                label="Teléfono"
                value={form.phone}
                onChange={(e) => {
                  setForm({ ...form, phone: e.target.value });
                }}
                required
              />
              <Input
                label="Email (opcional)"
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                }}
              />
              {formError && <p className="text-sm text-error">{formError}</p>}
              {submitError && (
                <p className="text-sm text-error">{submitError}</p>
              )}
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" type="button" onClick={back}>
                  <ArrowLeft
                    aria-hidden="true"
                    className="mr-1 inline h-4 w-4"
                  />
                  Volver
                </Button>
                <Button type="submit">Revisar y confirmar</Button>
              </div>
            </form>
          </div>
          <div>
            <h2 className="mb-4 text-lg font-semibold text-slate-100">
              Resumen
            </h2>
            <AppointmentSummary
              service={service}
              employee={employee}
              date={date}
              slot={slot}
              currency={currency}
            />
          </div>
        </section>
      )}

      <Modal
        isOpen={showConfirm}
        onClose={() => {
          if (!createAppointment.isPending) {
            setShowConfirm(false);
            setSubmitError("");
          }
        }}
        title="Confirmar turno"
      >
        {service && employee && slot && (
          <>
            <p className="mb-4 text-sm text-slate-400">
              Revisá los datos de tu reserva antes de confirmar.
            </p>
            <AppointmentSummary
              service={service}
              employee={employee}
              date={date}
              slot={slot}
              currency={currency}
            />
            <div className="mt-4 rounded-xl border border-border/60 bg-card px-4 py-3 text-sm">
              <p className="font-medium text-slate-100">
                {form.firstName} {form.lastName}
              </p>
              <p className="text-slate-400">
                {form.phone}
                {form.email.trim() ? ` · ${form.email.trim()}` : ""}
              </p>
            </div>
          </>
        )}
        {submitError && (
          <p className="mt-4 text-sm text-error">{submitError}</p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              setShowConfirm(false);
              setSubmitError("");
            }}
            disabled={createAppointment.isPending}
          >
            Volver
          </Button>
          <Button onClick={confirmBooking} disabled={createAppointment.isPending}>
            {createAppointment.isPending ? "Confirmando..." : "Confirmar turno"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
