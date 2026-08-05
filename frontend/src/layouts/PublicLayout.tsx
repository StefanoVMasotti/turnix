import { Outlet } from "react-router-dom";

export function PublicLayout() {
  return (
    <main className="min-h-screen bg-background text-slate-50">
      <Outlet />
    </main>
  );
}
