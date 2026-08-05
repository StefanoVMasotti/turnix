import type { AvailabilityDay } from "../../types/public";
import { weekdayLabel } from "../../utils/date";

interface CalendarProps {
  days: AvailabilityDay[];
  selectedDate: string | null;
  onSelect: (date: string) => void;
}

export function Calendar({ days, selectedDate, onSelect }: CalendarProps) {
  if (days.length === 0) {
    return <p className="text-sm text-slate-500">No hay disponibilidad en los próximos días.</p>;
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-7">
      {days.map((day) => {
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
  );
}
