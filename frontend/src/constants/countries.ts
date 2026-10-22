export interface Country {
  iso: string;
  name: string;
  dialCode: string;
  flag: string;
}

export const DEFAULT_COUNTRY_ISO = "AR";

export const COUNTRIES: Country[] = [
  { iso: "AR", name: "Argentina", dialCode: "54", flag: "🇦🇷" },
  { iso: "BR", name: "Brasil", dialCode: "55", flag: "🇧🇷" },
  { iso: "CL", name: "Chile", dialCode: "56", flag: "🇨🇱" },
  { iso: "UY", name: "Uruguay", dialCode: "598", flag: "🇺🇾" },
  { iso: "PY", name: "Paraguay", dialCode: "595", flag: "🇵🇾" },
  { iso: "BO", name: "Bolivia", dialCode: "591", flag: "🇧🇴" },
  { iso: "PE", name: "Perú", dialCode: "51", flag: "🇵🇪" },
  { iso: "EC", name: "Ecuador", dialCode: "593", flag: "🇪🇨" },
  { iso: "CO", name: "Colombia", dialCode: "57", flag: "🇨🇴" },
  { iso: "VE", name: "Venezuela", dialCode: "58", flag: "🇻🇪" },
  { iso: "MX", name: "México", dialCode: "52", flag: "🇲🇽" },
  { iso: "GT", name: "Guatemala", dialCode: "502", flag: "🇬🇹" },
  { iso: "CR", name: "Costa Rica", dialCode: "506", flag: "🇨🇷" },
  { iso: "PA", name: "Panamá", dialCode: "507", flag: "🇵🇦" },
  { iso: "DO", name: "República Dominicana", dialCode: "1", flag: "🇩🇴" },
  { iso: "CU", name: "Cuba", dialCode: "53", flag: "🇨🇺" },
  { iso: "PR", name: "Puerto Rico", dialCode: "1", flag: "🇵🇷" },
  { iso: "HN", name: "Honduras", dialCode: "504", flag: "🇭🇳" },
  { iso: "SV", name: "El Salvador", dialCode: "503", flag: "🇸🇻" },
  { iso: "NI", name: "Nicaragua", dialCode: "505", flag: "🇳🇮" },
  { iso: "ES", name: "España", dialCode: "34", flag: "🇪🇸" },
  { iso: "PT", name: "Portugal", dialCode: "351", flag: "🇵🇹" },
  { iso: "US", name: "Estados Unidos", dialCode: "1", flag: "🇺🇸" },
  { iso: "CA", name: "Canadá", dialCode: "1", flag: "🇨🇦" },
  { iso: "GB", name: "Reino Unido", dialCode: "44", flag: "🇬🇧" },
  { iso: "FR", name: "Francia", dialCode: "33", flag: "🇫🇷" },
  { iso: "DE", name: "Alemania", dialCode: "49", flag: "🇩🇪" },
  { iso: "IT", name: "Italia", dialCode: "39", flag: "🇮🇹" },
  { iso: "NL", name: "Países Bajos", dialCode: "31", flag: "🇳🇱" },
  { iso: "BE", name: "Bélgica", dialCode: "32", flag: "🇧🇪" },
  { iso: "CH", name: "Suiza", dialCode: "41", flag: "🇨🇭" },
  { iso: "IE", name: "Irlanda", dialCode: "353", flag: "🇮🇪" },
  { iso: "AU", name: "Australia", dialCode: "61", flag: "🇦🇺" },
  { iso: "NZ", name: "Nueva Zelanda", dialCode: "64", flag: "🇳🇿" },
  { iso: "JP", name: "Japón", dialCode: "81", flag: "🇯🇵" },
  { iso: "CN", name: "China", dialCode: "86", flag: "🇨🇳" },
  { iso: "IN", name: "India", dialCode: "91", flag: "🇮🇳" },
  { iso: "ZA", name: "Sudáfrica", dialCode: "27", flag: "🇿🇦" },
  { iso: "IL", name: "Israel", dialCode: "972", flag: "🇮🇱" },
  { iso: "RU", name: "Rusia", dialCode: "7", flag: "🇷🇺" },
  { iso: "SE", name: "Suecia", dialCode: "46", flag: "🇸🇪" },
  { iso: "NO", name: "Noruega", dialCode: "47", flag: "🇳🇴" },
  { iso: "DK", name: "Dinamarca", dialCode: "45", flag: "🇩🇰" },
  { iso: "FI", name: "Finlandia", dialCode: "358", flag: "🇫🇮" },
  { iso: "AT", name: "Austria", dialCode: "43", flag: "🇦🇹" },
  { iso: "PL", name: "Polonia", dialCode: "48", flag: "🇵🇱" },
  { iso: "GR", name: "Grecia", dialCode: "30", flag: "🇬🇷" },
  { iso: "TR", name: "Turquía", dialCode: "90", flag: "🇹🇷" },
  { iso: "SA", name: "Arabia Saudita", dialCode: "966", flag: "🇸🇦" },
  { iso: "AE", name: "Emiratos Árabes Unidos", dialCode: "971", flag: "🇦🇪" },
  { iso: "EG", name: "Egipto", dialCode: "20", flag: "🇪🇬" },
  { iso: "MA", name: "Marruecos", dialCode: "212", flag: "🇲🇦" }
];
