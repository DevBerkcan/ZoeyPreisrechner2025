/*
  Warnings:

  - You are about to drop the column `serviceType` on the `TenantService` table. All the data in the column will be lost.
  - Added the required column `serviceTypeId` to the `TenantService` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TenantService_tenantId_gender_serviceType_idx";

-- AlterTable
ALTER TABLE "TenantService" DROP COLUMN "serviceType",
ADD COLUMN     "serviceTypeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TenantServiceType" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantServiceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playing_with_neon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" REAL,

    CONSTRAINT "playing_with_neon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TenantServiceType_tenantId_idx" ON "TenantServiceType"("tenantId");

-- CreateIndex
CREATE INDEX "TenantService_tenantId_gender_serviceTypeId_idx" ON "TenantService"("tenantId", "gender", "serviceTypeId");

-- AddForeignKey
ALTER TABLE "TenantService" ADD CONSTRAINT "TenantService_serviceTypeId_fkey" FOREIGN KEY ("serviceTypeId") REFERENCES "TenantServiceType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantServiceType" ADD CONSTRAINT "TenantServiceType_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
