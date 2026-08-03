import { Clock } from "lucide-react";
import type { PublicService } from "../../types/public";
import { formatCurrency } from "../../utils/date";

interface ServiceCardProps {
  service: PublicService;
  currency: string;
  selected: boolean;
  onSelect: () => void;
}

export function ServiceCard({ service, currency, selected, onSelect }: ServiceCardProps) {
  const prices = service.employees.map((e) => Number(e.price));
  const min = prices.length > 0 ? Math.min(...prices) : null;
  const max = prices.length > 0 ? Math.max(...prices) : null;

  let priceLabel: string;
  if (min === null || max === null) {
    priceLabel = "Sin profesionales disponibles";
  } else if (min === max) {
    priceLabel = formatCurrency(min, currency);
  } else {
    priceLabel = `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
  }

  return (
    <button
      onClick={onSelect}
      className={`text-left rounded-2xl border p-5 transition-colors ${
        selected
          ? "border-primary bg-primary/10"
          : "border-border bg-card hover:border-primary/60 hover:bg-card/80"
      }`}
    >
      <h3 className="text-base font-semibold text-slate-100">{service.name}</h3>
      {service.description && (
        <p className="mt-1 text-sm text-slate-400 line-clamp-2">{service.description}</p>
      )}
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-1.5 text-slate-300">
          <Clock aria-hidden="true" className="h-4 w-4" />
          {service.durationMinutes} min
        </span>
        <span className="font-medium text-primary">{priceLabel}</span>
      </div>
    </button>
  );
}
