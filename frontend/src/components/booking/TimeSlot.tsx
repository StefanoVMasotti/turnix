import type { TimeSlot } from "../../types/public";
import { formatTime } from "../../utils/date";

interface TimeSlotProps {
  slot: TimeSlot;
  selected: boolean;
  onSelect: () => void;
}

export function TimeSlot({ slot, selected, onSelect }: TimeSlotProps) {
  return (
    <button
      onClick={onSelect}
      className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
        selected
          ? "border-primary bg-primary text-white"
          : "border-border bg-card text-slate-200 hover:border-primary/60"
      }`}
    >
      {formatTime(slot.startTime)}
    </button>
  );
}
