/*
  Warnings:

  - The primary key for the `CronMail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `orderId` on the `CronMail` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "CronMail_orderId_key";

-- AlterTable
ALTER TABLE "CronMail" DROP CONSTRAINT "CronMail_pkey",
DROP COLUMN "orderId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "CronMail_pkey" PRIMARY KEY ("id");
