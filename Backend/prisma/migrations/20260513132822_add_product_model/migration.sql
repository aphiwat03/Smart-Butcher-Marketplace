/*
  Warnings:

  - You are about to drop the column `OwnerUserId` on the `Store` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ownerUserId]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerUserId` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_OwnerUserId_fkey";

-- DropIndex
DROP INDEX "Store_OwnerUserId_idx";

-- DropIndex
DROP INDEX "Store_OwnerUserId_key";

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "OwnerUserId",
ADD COLUMN     "ownerUserId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "storeId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "stockQuantity" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_storeId_idx" ON "Product"("storeId");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Store_ownerUserId_key" ON "Store"("ownerUserId");

-- CreateIndex
CREATE INDEX "Store_ownerUserId_idx" ON "Store"("ownerUserId");

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
