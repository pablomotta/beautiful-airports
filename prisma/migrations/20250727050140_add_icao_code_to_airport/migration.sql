/*
  Warnings:

  - A unique constraint covering the columns `[icaoCode]` on the table `Airport` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Airport" ADD COLUMN     "icaoCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Airport_icaoCode_key" ON "Airport"("icaoCode");
