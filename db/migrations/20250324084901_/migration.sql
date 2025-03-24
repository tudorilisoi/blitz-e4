/*
  Warnings:

  - The values [PROMOTED] on the enum `PostStatuses` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PostStatuses_new" AS ENUM ('ACTIVE', 'EXPIRED_WARNING_SENT', 'EXPIRED');
ALTER TABLE "Post" ALTER COLUMN "status" TYPE "PostStatuses_new" USING ("status"::text::"PostStatuses_new");
ALTER TYPE "PostStatuses" RENAME TO "PostStatuses_old";
ALTER TYPE "PostStatuses_new" RENAME TO "PostStatuses";
DROP TYPE "PostStatuses_old";
COMMIT;
