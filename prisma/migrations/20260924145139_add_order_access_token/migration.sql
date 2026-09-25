/*
  Warnings:

  - A unique constraint covering the columns `[accessToken]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accessToken` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "accessToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_accessToken_key" ON "Order"("accessToken");
