import { formatCurrency, formatDate, weekdayLabel } from "../../utils/date";
import type { PublicService, PublicServiceEmployee, TimeSlot } from "../../types/public";

interface AppointmentSummaryProps {
  service: PublicService;
  employee: PublicServiceEmployee | null;
  date: string;
  slot: TimeSlot;
  currency: string;
}

export function AppointmentSummary({ service, employee, date, slot, currency }: AppointmentSummaryProps) {
  const price = employee ? Number(employee.price) : 0;

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-5 text-sm">
      <div className="flex justify-between">
        <span className="text-slate-400">Servicio</span>
        <span className="font-medium text-slate-100">{service.name}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">Profesional</span>
        <span className="font-medium text-slate-100">
          {employee ? `${employee.firstName} ${employee.lastName}` : "—"}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">Día</span>
        <span className="font-medium text-slate-100">
          {weekdayLabel(date)}, {formatDate(date)}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">Horario</span>
        <span className="font-medium text-slate-100">{slot.startTime.slice(0, 5)}</span>
      </div>
      <div className="flex justify-between border-t border-border pt-3">
        <span className="text-slate-400">Total</span>
        <span className="font-semibold text-primary">{formatCurrency(price, currency)}</span>
      </div>
    </div>
  );
}
