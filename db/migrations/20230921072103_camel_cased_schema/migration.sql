/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('SUPERADMIN', 'USER');

-- CreateEnum
CREATE TYPE "PostStatuses" AS ENUM ('ACTIVE', 'EXPIRED_WARNING_SENT', 'EXPIRED', 'PROMOTED');

-- CreateEnum
CREATE TYPE "currencies" AS ENUM ('EUR', 'RON');

-- CreateEnum
CREATE TYPE "CronStatuses" AS ENUM ('pending', 'success', 'fail');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activationKey" VARCHAR(255),
ADD COLUMN     "banned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastVisitAt" TIMESTAMP(3),
ADD COLUMN     "phone" VARCHAR(30),
DROP COLUMN "role",
ADD COLUMN     "role" "UserRoles" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "CronMail" (
    "orderId" VARCHAR(255) NOT NULL DEFAULT '',
    "lastExecuted" TIMESTAMP(3),
    "status" "CronStatuses" NOT NULL,
    "retries" INTEGER NOT NULL DEFAULT 0,
    "lastErrorJson" TEXT NOT NULL,

    CONSTRAINT "CronMail_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL DEFAULT '',
    "slug" VARCHAR(255) NOT NULL DEFAULT '',
    "body" TEXT NOT NULL DEFAULT '',
    "status" "PostStatuses" NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "currency" "currencies" NOT NULL,
    "phone" VARCHAR(30),
    "categoryId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL DEFAULT '',
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CronMail_orderId_key" ON "CronMail"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
