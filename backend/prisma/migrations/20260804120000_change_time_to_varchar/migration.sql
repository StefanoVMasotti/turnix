-- AlterTable: Convert TIME(0) columns to VARCHAR(8) for time-of-day storage

-- DropCheck
ALTER TABLE "employee_schedules" DROP CONSTRAINT "employee_schedules_time_range_check";
ALTER TABLE "employee_blocks" DROP CONSTRAINT "employee_blocks_time_range_check";
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_time_range_check";

-- AlterTable employee_schedules
ALTER TABLE "employee_schedules" ALTER COLUMN "start_time" DROP DEFAULT;
ALTER TABLE "employee_schedules" ALTER COLUMN "start_time" TYPE VARCHAR(8) USING TO_CHAR("start_time", 'HH24:MI:SS');
ALTER TABLE "employee_schedules" ALTER COLUMN "end_time" DROP DEFAULT;
ALTER TABLE "employee_schedules" ALTER COLUMN "end_time" TYPE VARCHAR(8) USING TO_CHAR("end_time", 'HH24:MI:SS');

-- AlterTable employee_blocks
ALTER TABLE "employee_blocks" ALTER COLUMN "start_time" DROP DEFAULT;
ALTER TABLE "employee_blocks" ALTER COLUMN "start_time" TYPE VARCHAR(8) USING TO_CHAR("start_time", 'HH24:MI:SS');
ALTER TABLE "employee_blocks" ALTER COLUMN "end_time" DROP DEFAULT;
ALTER TABLE "employee_blocks" ALTER COLUMN "end_time" TYPE VARCHAR(8) USING TO_CHAR("end_time", 'HH24:MI:SS');

-- AlterTable appointments
ALTER TABLE "appointments" ALTER COLUMN "start_time" DROP DEFAULT;
ALTER TABLE "appointments" ALTER COLUMN "start_time" TYPE VARCHAR(8) USING TO_CHAR("start_time", 'HH24:MI:SS');
ALTER TABLE "appointments" ALTER COLUMN "end_time" DROP DEFAULT;
ALTER TABLE "appointments" ALTER COLUMN "end_time" TYPE VARCHAR(8) USING TO_CHAR("end_time", 'HH24:MI:SS');

-- RecreateCheck (string comparison works for HH:MI:SS format)
ALTER TABLE "employee_schedules" ADD CONSTRAINT "employee_schedules_time_range_check" CHECK ("start_time" < "end_time");
ALTER TABLE "employee_blocks" ADD CONSTRAINT "employee_blocks_time_range_check" CHECK ("start_time" < "end_time");
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_time_range_check" CHECK ("start_time" < "end_time");
