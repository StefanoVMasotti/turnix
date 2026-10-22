import { formatDate, formatTime } from "./date";
import type { Appointment } from "../types/appointment";

export function buildWhatsappMessage(
  apt: Appointment,
  businessName?: string | null,
): string {
  const nombre =
    apt.client?.firstName.trim() || apt.client?.lastName.trim() || "";
  const saludo = nombre ? `¡Hola ${nombre}!` : "¡Hola!";
  const servicio = apt.service?.name ?? "servicio";
  const fecha = formatDate(apt.appointmentDate);
  const hora = formatTime(apt.startTime);
  const cierre = `¡Muchas gracias!`;

  return [
    saludo,
    `Te recordamos tu turno: ${servicio}`,
    `Día y hora: ${fecha}, ${hora}`,
    "Si no podes asistir, avisanos.",
    cierre,
  ].join("\n");
}

export function buildWhatsappUrl(
  phone: string | null | undefined,
  message: string,
): string {
  const digits = (phone ?? "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function phoneHasDigits(phone: string | null | undefined): boolean {
  return (phone ?? "").replace(/\D/g, "").length >= 8;
}
