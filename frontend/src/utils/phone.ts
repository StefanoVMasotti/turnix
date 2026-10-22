import { COUNTRIES, DEFAULT_COUNTRY_ISO, type Country } from "../constants/countries";

const PHONE_DIGITS_REGEX = /^\d{8,15}$/;

export interface ParsedPhone {
  country: Country;
  national: string;
}

function fallbackCountry(): Country {
  return COUNTRIES.find((c) => c.iso === DEFAULT_COUNTRY_ISO) ?? COUNTRIES[0];
}

function findByIso(iso: string): Country | undefined {
  return COUNTRIES.find((c) => c.iso === iso);
}

/**
 * Divide un número internacional en solo dígitos (ej: 541155555555)
 * en su país y número nacional, haciendo match por el prefijo telefónico
 * más largo posible.
 */
export function parsePhoneDigits(digits: string, preferredIso?: string): ParsedPhone {
  const clean = digits.replace(/\D/g, "");

  if (!clean) {
    return { country: findByIso(preferredIso ?? DEFAULT_COUNTRY_ISO) ?? fallbackCountry(), national: "" };
  }

  // Si el país preferido coincide con el prefijo, respetar la selección del usuario.
  if (preferredIso) {
    const preferred = findByIso(preferredIso);
    if (preferred && clean.startsWith(preferred.dialCode)) {
      return { country: preferred, national: clean.slice(preferred.dialCode.length) };
    }
  }

  const sorted = [...COUNTRIES].sort((a, b) => b.dialCode.length - a.dialCode.length);
  const match = sorted.find((c) => clean.startsWith(c.dialCode));

  if (match) {
    return { country: match, national: clean.slice(match.dialCode.length) };
  }

  return { country: fallbackCountry(), national: clean };
}

/**
 * Arma el número internacional en solo dígitos a partir del prefijo del país
 * y el número nacional (sin el 0 inicial/trunk).
 */
export function buildPhoneValue(dialCode: string, national: string): string {
  const digits = national.replace(/\D/g, "").replace(/^0+/, "");
  return digits ? `${dialCode}${digits}` : "";
}

export function isValidPhoneDigits(digits: string): boolean {
  return PHONE_DIGITS_REGEX.test(digits);
}

function groupNational(national: string): string {
  return national.replace(/(\d{1,4})(?=(\d{4})*$)/g, "$1 ").trim();
}

/**
 * Formatea un número para mostrarlo (ej: 541155555555 → "+54 11 5555 5555").
 */
export function formatPhoneDisplay(digits: string | null | undefined): string {
  if (!digits) return "";
  const { country, national } = parsePhoneDigits(digits);
  if (!national) return `+${country.dialCode}`;
  return `+${country.dialCode} ${groupNational(national)}`;
}
