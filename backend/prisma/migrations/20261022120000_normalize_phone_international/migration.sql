-- Normaliza los teléfonos a formato internacional limpio, solo dígitos
-- (codigo de país + área + local, ej: 541155555555) para uso con wa.me.
-- Asume Argentina (+54) para números que no están marcados como internacionales.

-- 0. Función auxiliar de normalización
CREATE OR REPLACE FUNCTION _turnix_normalize_phone(raw text) RETURNS text AS $$
DECLARE
  d text;
  is_intl boolean;
BEGIN
  IF raw IS NULL THEN
    RETURN NULL;
  END IF;

  is_intl := raw ~ '^\s*\+';
  d := regexp_replace(raw, '\D', '', 'g');

  -- prefijo internacional 00
  IF d LIKE '00%' THEN
    d := substr(d, 3);
    is_intl := true;
  END IF;

  -- números no marcados como internacionales y sin código 54: asumir AR
  IF NOT is_intl AND d !~ '^54' THEN
    d := regexp_replace(d, '^0+', '');
    d := '54' || d;
  END IF;

  RETURN d;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 1. businesses: normalizar; inválidos (no 8-15 dígitos) → NULL
UPDATE businesses SET phone = _turnix_normalize_phone(phone) WHERE phone IS NOT NULL;
UPDATE businesses SET phone = NULL
  WHERE phone IS NOT NULL AND (length(phone) < 8 OR length(phone) > 15);

-- 2. employees: normalizar; inválidos → NULL
UPDATE employees SET phone = _turnix_normalize_phone(phone) WHERE phone IS NOT NULL;
UPDATE employees SET phone = NULL
  WHERE phone IS NOT NULL AND (length(phone) < 8 OR length(phone) > 15);

-- 3. clients: normalizar (columna NOT NULL, no se puede poner NULL)
DROP INDEX IF EXISTS "unique_business_client_phone";
UPDATE clients SET phone = _turnix_normalize_phone(phone);
-- recoger a 15 dígitos máximos para que quepa en VARCHAR(15)
UPDATE clients SET phone = left(phone, 15) WHERE length(phone) > 15;

-- 3a. Dedupe por (business_id, phone) tras normalizar:
--     conservar el más antiguo, reasignar sus turnos y borrar el resto.
CREATE TEMP TABLE _client_dedup ON COMMIT DROP AS
SELECT
  id,
  business_id,
  phone,
  ROW_NUMBER() OVER (
    PARTITION BY business_id, phone
    ORDER BY created_at ASC, id ASC
  ) AS rn,
  FIRST_VALUE(id) OVER (
    PARTITION BY business_id, phone
    ORDER BY created_at ASC, id ASC
  ) AS keeper_id
FROM clients;

UPDATE appointments a
SET client_id = d.keeper_id
FROM _client_dedup d
WHERE a.client_id = d.id AND d.rn > 1;

DELETE FROM clients c
USING _client_dedup d
WHERE c.id = d.id AND d.rn > 1;

DROP TABLE _client_dedup;

-- 3b. Recrear el índice único sobre el teléfono ya normalizado
CREATE UNIQUE INDEX "unique_business_client_phone" ON "clients"("business_id", "phone");

-- 4. Reducir las columnas a VARCHAR(15) (máximo E.164)
ALTER TABLE "businesses" ALTER COLUMN "phone" TYPE VARCHAR(15);
ALTER TABLE "employees" ALTER COLUMN "phone" TYPE VARCHAR(15);
ALTER TABLE "clients" ALTER COLUMN "phone" TYPE VARCHAR(15);

-- 5. CHECK constraints (NOT VALID: no validan filas legacy, solo escrituras nuevas)
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_phone_format_check"
  CHECK (phone IS NULL OR phone ~ '^[0-9]{8,15}$') NOT VALID;
ALTER TABLE "employees" ADD CONSTRAINT "employees_phone_format_check"
  CHECK (phone IS NULL OR phone ~ '^[0-9]{8,15}$') NOT VALID;
ALTER TABLE "clients" ADD CONSTRAINT "clients_phone_format_check"
  CHECK (phone ~ '^[0-9]{8,15}$') NOT VALID;

-- 6. Reportar clientes con teléfono aún inválido tras la normalización
DO $$
DECLARE
  invalid_count integer;
BEGIN
  SELECT COUNT(*) INTO invalid_count
  FROM clients WHERE phone !~ '^[0-9]{8,15}$';
  IF invalid_count > 0 THEN
    RAISE NOTICE 'Hay % cliente(s) con teléfono inválido tras la normalización. Corregir manualmente.',
      invalid_count;
  END IF;
END $$;

-- 7. Limpiar la función auxiliar
DROP FUNCTION _turnix_normalize_phone(text);
