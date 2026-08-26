import type { ReactNode } from "react";

interface BadgeProps {
  variant?: "success" | "warning" | "danger" | "info";
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = "info", children, className = "" }: BadgeProps) {
  const variants = {
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    danger: "bg-error/20 text-error",
    info: "bg-primary/20 text-primary"
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
