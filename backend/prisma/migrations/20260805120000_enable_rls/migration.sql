-- Enable Row Level Security on all tables
ALTER TABLE "businesses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "business_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "employees" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "services" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "employee_services" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "employee_schedules" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "employee_time_off" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "employee_blocks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clients" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "appointments" ENABLE ROW LEVEL SECURITY;

-- Permissive policies: allow full access via service_role (backend)
CREATE POLICY "Allow all for service role" ON "businesses" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role" ON "business_settings" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role" ON "users" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role" ON "employees" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role" ON "services" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role" ON "employee_services" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role" ON "employee_schedules" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role" ON "employee_time_off" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role" ON "employee_blocks" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role" ON "clients" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for service role" ON "appointments" FOR ALL USING (true) WITH CHECK (true);

-- Enable RLS on Prisma internal table
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for service role" ON "_prisma_migrations" FOR ALL USING (true) WITH CHECK (true);
