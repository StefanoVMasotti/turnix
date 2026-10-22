const PHONE_DIGITS_REGEX = /^\d{8,15}$/;

export function normalizePhone(value: string): string {
  let digits = value.trim().replace(/^\+/, "");

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  return digits.replace(/\D/g, "");
}

export function isValidPhone(digits: string): boolean {
  return PHONE_DIGITS_REGEX.test(digits);
}
