-- CreateIndex
CREATE INDEX "idx_schedule_employee_day" ON "employee_schedules"("employee_id", "day_of_week");

-- CreateIndex
CREATE INDEX "idx_timeoff_employee_range" ON "employee_time_off"("employee_id", "start_date", "end_date");

-- CreateIndex
CREATE INDEX "idx_block_employee_date" ON "employee_blocks"("employee_id", "block_date");

-- CreateIndex
CREATE UNIQUE INDEX "unique_business_client_phone" ON "clients"("business_id", "phone");

-- CreateIndex
CREATE INDEX "idx_appointment_business_date" ON "appointments"("business_id", "appointment_date");

-- CreateIndex
CREATE INDEX "idx_appointment_business_status_date" ON "appointments"("business_id", "status", "appointment_date");
