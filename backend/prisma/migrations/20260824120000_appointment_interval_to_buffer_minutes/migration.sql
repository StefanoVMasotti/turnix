ALTER TABLE "business_settings" DROP COLUMN "appointment_interval";
ALTER TABLE "business_settings" ADD COLUMN "buffer_minutes" INTEGER NOT NULL DEFAULT 0;
