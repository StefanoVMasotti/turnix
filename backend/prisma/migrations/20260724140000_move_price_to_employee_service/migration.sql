-- Step 1: Add price column to employee_services as nullable
ALTER TABLE "employee_services" ADD COLUMN "price" DECIMAL(10, 2);

-- Step 2: Copy prices from services to employee_services
UPDATE "employee_services" es
SET "price" = s."price"
FROM "services" s
WHERE es."service_id" = s."id" AND es."price" IS NULL;

-- Step 3: Make price NOT NULL
ALTER TABLE "employee_services" ALTER COLUMN "price" SET NOT NULL;

-- Step 4: Drop price column from services
ALTER TABLE "services" DROP COLUMN "price";
