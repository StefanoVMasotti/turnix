-- Drop overly permissive RLS policies
-- RLS remains enabled, but no policies = PostgREST blocks all access
-- Prisma bypasses RLS via postgres superuser, so this is correct

DROP POLICY IF EXISTS "Allow all for service role" ON "businesses";
DROP POLICY IF EXISTS "Allow all for service role" ON "business_settings";
DROP POLICY IF EXISTS "Allow all for service role" ON "users";
DROP POLICY IF EXISTS "Allow all for service role" ON "employees";
DROP POLICY IF EXISTS "Allow all for service role" ON "services";
DROP POLICY IF EXISTS "Allow all for service role" ON "employee_services";
DROP POLICY IF EXISTS "Allow all for service role" ON "employee_schedules";
DROP POLICY IF EXISTS "Allow all for service role" ON "employee_time_off";
DROP POLICY IF EXISTS "Allow all for service role" ON "employee_blocks";
DROP POLICY IF EXISTS "Allow all for service role" ON "clients";
DROP POLICY IF EXISTS "Allow all for service role" ON "appointments";
DROP POLICY IF EXISTS "Allow all for service role" ON "_prisma_migrations";
