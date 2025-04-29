/*
  Warnings:

  - Added the required column `updateAt` to the `admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;
