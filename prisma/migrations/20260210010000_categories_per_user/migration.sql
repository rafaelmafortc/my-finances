-- Drop existing unique on name
DROP INDEX IF EXISTS "Category_name_key";

-- Add userId column as nullable
ALTER TABLE "Category" ADD COLUMN "userId" TEXT;

-- Assign existing categories to the first user (so we keep data)
UPDATE "Category" SET "userId" = (SELECT "id" FROM "User" LIMIT 1) WHERE "userId" IS NULL;

ALTER TABLE "Category" ALTER COLUMN "userId" SET NOT NULL;

-- Add FK and unique per user
CREATE UNIQUE INDEX "Category_userId_name_key" ON "Category"("userId", "name");
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
