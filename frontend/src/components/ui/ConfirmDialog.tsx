import type { ReactNode } from "react";
import { AlertTriangle, CalendarCheck } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger";
  loading?: boolean;
}

const VARIANTS = {
  primary: {
    icon: CalendarCheck,
    iconClasses: "bg-primary/10 text-primary",
    confirmVariant: "primary" as const
  },
  danger: {
    icon: AlertTriangle,
    iconClasses: "bg-error/10 text-error",
    confirmVariant: "danger" as const
  }
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "primary",
  loading = false
}: ConfirmDialogProps) {
  const { icon: Icon, iconClasses, confirmVariant } = VARIANTS[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconClasses}`}
        >
          <Icon size={22} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1 pt-0.5 text-sm leading-relaxed text-slate-300">
          {description}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm} disabled={loading}>
          {loading ? "Procesando..." : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
