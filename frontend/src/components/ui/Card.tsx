import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  headerRight?: ReactNode;
}

export function Card({ title, children, className = "", headerRight }: CardProps) {
  return (
    <div className={`bg-card border border-border rounded-2xl p-5 ${className}`}>
      {(title || headerRight) && (
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 className="text-base font-semibold text-slate-100">
              {title}
            </h3>
          )}
          {headerRight}
        </div>
      )}
      {children}
    </div>
  );
}
