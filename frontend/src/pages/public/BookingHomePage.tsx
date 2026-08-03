import { ArrowRight } from "lucide-react";

export function BookingHomePage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-65px)] max-w-6xl items-center px-6 py-12">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-primary">Reserva online</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-slate-50">
          Turnos simples para negocios que trabajan con citas
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
          Punto de partida del flujo público: servicio, profesional, fecha, horario y confirmación.
        </p>
        <button className="mt-8 inline-flex items-center gap-2 rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover">
          Comenzar reserva
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
