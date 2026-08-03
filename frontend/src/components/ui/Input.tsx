import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-slate-400">
          {label}
        </label>
      )}
      <input
        className={`bg-surface border border-border rounded-[10px] px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-primary disabled:opacity-50 ${error ? "border-error" : ""} ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs text-error">{error}</span>
      )}
    </div>
  );
}
