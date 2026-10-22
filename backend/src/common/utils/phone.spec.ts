import { isValidPhone, normalizePhone } from "./phone";

describe("normalizePhone", () => {
  it("debería quitar espacios, guiones y paréntesis", () => {
    expect(normalizePhone("+54 11 5555-5555")).toBe("541155555555");
    expect(normalizePhone("(54) 11-5555 5555")).toBe("541155555555");
  });

  it("debería quitar el signo + inicial", () => {
    expect(normalizePhone("+541155555555")).toBe("541155555555");
  });

  it("debería quitar el prefijo internacional 00", () => {
    expect(normalizePhone("00541155555555")).toBe("541155555555");
    expect(normalizePhone("+00541155555555")).toBe("541155555555");
  });

  it("debería devolver solo dígitos en números ya limpios", () => {
    expect(normalizePhone("541155555555")).toBe("541155555555");
  });

  it("debería recortar espacios al inicio y al final", () => {
    expect(normalizePhone("  541155555555  ")).toBe("541155555555");
  });
});

describe("isValidPhone", () => {
  it("debería aceptar números internacionales de 8 a 15 dígitos", () => {
    expect(isValidPhone("541155555555")).toBe(true);
    expect(isValidPhone("12345678")).toBe(true);
    expect(isValidPhone("123456789012345")).toBe(true);
  });

  it("debería rechazar números con menos de 8 dígitos", () => {
    expect(isValidPhone("5411555")).toBe(false);
    expect(isValidPhone("")).toBe(false);
  });

  it("debería rechazar números con más de 15 dígitos", () => {
    expect(isValidPhone("1234567890123456")).toBe(false);
  });

  it("debería rechazar valores con caracteres no numéricos", () => {
    expect(isValidPhone("54 11 5555-5555")).toBe(false);
    expect(isValidPhone("+541155555555")).toBe(false);
  });
});
