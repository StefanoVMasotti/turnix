import { useEffect, useState } from "react";
import { COUNTRIES, DEFAULT_COUNTRY_ISO } from "../../constants/countries";
import { buildPhoneValue, parsePhoneDigits } from "../../utils/phone";

interface PhoneInputProps {
  label?: string;
  /** Número internacional en solo dígitos, con código de país (ej: 541155555555). */
  value: string;
  onChange: (digits: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  defaultCountryIso?: string;
}

export function PhoneInput({
  label,
  value,
  onChange,
  error,
  required,
  disabled,
  defaultCountryIso = DEFAULT_COUNTRY_ISO,
}: PhoneInputProps) {
  const [countryIso, setCountryIso] = useState(defaultCountryIso);

  // Al cargar un valor externo (editar), detectar su país.
  useEffect(() => {
    if (!value) return;
    const dial = COUNTRIES.find((c) => c.iso === countryIso)?.dialCode;
    if (dial && value.startsWith(dial)) return;
    setCountryIso(parsePhoneDigits(value).country.iso);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const country = COUNTRIES.find((c) => c.iso === countryIso) ?? COUNTRIES[0];
  const national = value.startsWith(country.dialCode)
    ? value.slice(country.dialCode.length)
    : "";

  function handleCountryChange(iso: string) {
    setCountryIso(iso);
    const next = COUNTRIES.find((c) => c.iso === iso);
    if (!next) return;
    onChange(national ? buildPhoneValue(next.dialCode, national) : "");
  }

  function handleNationalChange(raw: string) {
    const digits = raw.replace(/\D/g, "");
    onChange(buildPhoneValue(country.dialCode, digits));
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-slate-400">{label}</label>
      )}
      <div className="flex gap-2">
        <select
          aria-label="País"
          value={countryIso}
          onChange={(e) => {
            handleCountryChange(e.target.value);
          }}
          disabled={disabled}
          className="bg-surface border border-border rounded-[10px] px-2 py-2 text-sm text-slate-200 focus:outline-none focus:border-primary disabled:opacity-50"
        >
          {COUNTRIES.map((c) => (
            <option key={c.iso} value={c.iso}>
              {c.flag} +{c.dialCode}
            </option>
          ))}
        </select>
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={national}
          onChange={(e) => {
            handleNationalChange(e.target.value);
          }}
          placeholder="Número"
          disabled={disabled}
          required={required}
          className={`flex-1 min-w-0 bg-surface border border-border rounded-[10px] px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-primary disabled:opacity-50 ${error ? "border-error" : ""}`}
        />
      </div>
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  );
}
