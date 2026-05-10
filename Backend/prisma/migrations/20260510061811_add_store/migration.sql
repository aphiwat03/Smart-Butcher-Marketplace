-- CreateEnum
CREATE TYPE "StoreStatus" AS ENUM ('OPEN', 'CLOSED', 'SUSPENDED');

-- CreateTable
CREATE TABLE "Store" (
    "id" SERIAL NOT NULL,
    "OwnerUserId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "StoreStatus" NOT NULL DEFAULT 'OPEN',
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Store_OwnerUserId_key" ON "Store"("OwnerUserId");

-- CreateIndex
CREATE INDEX "Store_OwnerUserId_idx" ON "Store"("OwnerUserId");

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_OwnerUserId_fkey" FOREIGN KEY ("OwnerUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
