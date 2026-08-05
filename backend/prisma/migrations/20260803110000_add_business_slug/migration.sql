-- Add slug column to businesses (unique identifier for public URLs)
ALTER TABLE "businesses" ADD COLUMN "slug" VARCHAR(50);

-- Backfill slug from name for existing rows
UPDATE "businesses"
SET "slug" = lower(regexp_replace(
    translate(lower(name), 'áéíóúüñàèìòù', 'aeiouun'),
    '[^a-z0-9]+', '-', 'g'
))
WHERE "slug" IS NULL OR "slug" = '';

ALTER TABLE "businesses" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "businesses_slug_key" ON "businesses"("slug");
