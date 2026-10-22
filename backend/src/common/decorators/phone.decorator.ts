import { applyDecorators } from "@nestjs/common";
import { Transform } from "class-transformer";
import { Matches } from "class-validator";
import { normalizePhone } from "../utils/phone";

export const PHONE_DIGITS_PATTERN = /^\d{8,15}$/;

export const PHONE_DIGITS_MESSAGE =
  "El teléfono debe ser internacional en solo dígitos, incluyendo el código de país (ej: 541155555555).";

/**
 * Normaliza un teléfono escrito con formato (+54 11 5555-5555, 0054..., etc.)
 * a solo dígitos internacionales y valida el resultado.
 */
export function IsNormalizedPhone() {
  return applyDecorators(
    Transform(({ value }) => {
      if (typeof value !== "string") {
        return value as unknown;
      }
      return normalizePhone(value);
    }),
    Matches(PHONE_DIGITS_PATTERN, { message: PHONE_DIGITS_MESSAGE })
  );
}

/**
 * Igual que IsNormalizedPhone, pero para campos opcionales: convierte
 * cadenas vacías o solo espacios en null para limpiar el valor en la BD.
 * Usar junto con @IsOptional() en el DTO (null/undefined salta la validación).
 */
export function IsNormalizedOptionalPhone() {
  return applyDecorators(
    Transform(({ value }) => {
      if (value === null || value === undefined) {
        return value as unknown;
      }
      if (typeof value !== "string") {
        return value as unknown;
      }
      const normalized = normalizePhone(value);
      return normalized === "" ? null : normalized;
    }),
    Matches(PHONE_DIGITS_PATTERN, { message: PHONE_DIGITS_MESSAGE })
  );
}
