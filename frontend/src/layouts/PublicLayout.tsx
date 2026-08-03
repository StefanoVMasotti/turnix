import { CalendarClock } from "lucide-react";
import { Outlet } from "react-router-dom";

export function PublicLayout() {
  return (
    <main className="min-h-screen bg-background text-slate-50">
      <header className="border-b border-border bg-surface/70">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-4">
          <CalendarClock aria-hidden="true" className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Turnix</span>
        </div>
      </header>
      <Outlet />
    </main>
  );
}
