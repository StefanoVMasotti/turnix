import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Button({ variant = "primary", size = "md", children, className = "", ...props }: ButtonProps) {
  const base = "rounded-[10px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary hover:bg-primary-hover text-white",
    secondary: "bg-transparent border border-border text-slate-300 hover:bg-surface",
    danger: "bg-error hover:bg-red-600 text-white"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm min-h-[36px]",
    md: "px-4 py-2.5 text-sm min-h-[40px]",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
