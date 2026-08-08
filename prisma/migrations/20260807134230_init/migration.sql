/*
  Warnings:

  - You are about to drop the column `gst` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sku]` on the table `MenuItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Admin" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT;

-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "public"."MenuItem" ADD COLUMN     "preparationTime" INTEGER NOT NULL DEFAULT 20,
ADD COLUMN     "sku" TEXT;

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "gst",
ADD COLUMN     "landmark" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "pincode" TEXT,
ADD COLUMN     "tax" DECIMAL(10,2) NOT NULL;

-- CreateTable
CREATE TABLE "public"."RestaurantSetting" (
    "id" TEXT NOT NULL,
    "restaurantName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT NOT NULL,
    "deliveryRadius" INTEGER NOT NULL DEFAULT 3,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "openingTime" TEXT NOT NULL,
    "closingTime" TEXT NOT NULL,
    "logo" TEXT,
    "banner" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Banner" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_sku_key" ON "public"."MenuItem"("sku");

-- CreateIndex
CREATE INDEX "MenuItem_categoryId_idx" ON "public"."MenuItem"("categoryId");

-- CreateIndex
CREATE INDEX "MenuItem_foodType_idx" ON "public"."MenuItem"("foodType");

-- CreateIndex
CREATE INDEX "MenuItem_isAvailable_idx" ON "public"."MenuItem"("isAvailable");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "public"."Order"("status");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "public"."Order"("createdAt");
