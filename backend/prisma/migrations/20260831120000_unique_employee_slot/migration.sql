-- Eliminar turnos duplicados manteniendo el más reciente (por created_at)
-- basado en la combinación de employee_id, appointment_date, start_time
WITH duplicates AS (
  SELECT id,
    ROW_NUMBER() OVER (
      PARTITION BY employee_id, appointment_date, start_time
      ORDER BY created_at DESC
    ) AS rn
  FROM appointments
)
DELETE FROM appointments
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- Ahora sí, crear el índice único
CREATE UNIQUE INDEX "unique_employee_slot" ON "appointments"("employee_id", "appointment_date", "start_time");
