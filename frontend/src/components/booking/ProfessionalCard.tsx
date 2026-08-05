import { User } from "lucide-react";
import type { PublicServiceEmployee } from "../../types/public";
import { formatCurrency } from "../../utils/date";

interface ProfessionalCardProps {
  employee: PublicServiceEmployee;
  currency: string;
  selected: boolean;
  onSelect: () => void;
}

export function ProfessionalCard({
  employee,
  currency,
  selected,
  onSelect
}: ProfessionalCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`flex items-center justify-between rounded-2xl border p-4 transition-colors ${
        selected
          ? "border-primary bg-primary/10"
          : "border-border bg-card hover:border-primary/60 hover:bg-card/80"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-slate-300">
          <User aria-hidden="true" className="h-5 w-5" />
        </div>
        <span className="text-sm font-medium text-slate-100">
          {employee.firstName} {employee.lastName}
        </span>
      </div>
      <span className="text-sm font-medium text-primary">
        {formatCurrency(employee.price, currency)}
      </span>
    </button>
  );
}
