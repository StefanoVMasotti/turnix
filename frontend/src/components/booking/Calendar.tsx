import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AvailabilityDay } from "../../types/public";
import { weekdayLabel } from "../../utils/date";
import { Spinner } from "../ui/Spinner";

interface CalendarProps {
  days: AvailabilityDay[];
  selectedDate: string | null;
  onSelect: (date: string) => void;
  isLoading?: boolean;
}

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function getMonthYear(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function Calendar({ days, selectedDate, onSelect, isLoading }: CalendarProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  if (isLoading) {
    return <Spinner className="py-8" />;
  }

  if (days.length === 0) {
    return <p className="text-sm text-slate-500">No hay disponibilidad en los próximos días.</p>;
  }

  const maxOffset = Math.floor((days.length - 1) / 7);
  const weekStart = weekOffset * 7;
  const visibleDays = days.slice(weekStart, weekStart + 7);
  const monthLabel = visibleDays.length > 0 ? getMonthYear(visibleDays[0].date) : "";

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => { setWeekOffset((o) => o - 1); }}
          disabled={weekOffset === 0}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-card transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-medium text-slate-200">{monthLabel}</span>
        <button
          onClick={() => { setWeekOffset((o) => o + 1); }}
          disabled={weekOffset >= maxOffset}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-card transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {visibleDays.map((day) => {
          const available = day.available;
          const selected = day.date === selectedDate;

          return (
            <button
              key={day.date}
              disabled={!available}
              onClick={() => { onSelect(day.date); }}
              className={`flex flex-col items-center rounded-xl border px-2 py-3 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                selected
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-card hover:border-primary/60"
              }`}
            >
              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                {weekdayLabel(day.date).slice(0, 3)}
              </span>
              <span className="mt-1 text-lg font-semibold text-slate-100">
                {day.date.slice(8, 10)}
              </span>
              {available && <span className="mt-1 text-[10px] text-slate-500">{day.slotsCount}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
