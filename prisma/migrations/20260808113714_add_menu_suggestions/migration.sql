/*
  Warnings:

  - You are about to drop the column `preparationTime` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `MenuItem` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."MenuItem_sku_key";

-- AlterTable
ALTER TABLE "public"."MenuItem" DROP COLUMN "preparationTime",
DROP COLUMN "sku";

-- CreateTable
CREATE TABLE "public"."MenuItemSuggestion" (
    "id" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    "suggestedItemId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MenuItemSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MenuItemSuggestion_menuItemId_idx" ON "public"."MenuItemSuggestion"("menuItemId");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItemSuggestion_menuItemId_suggestedItemId_key" ON "public"."MenuItemSuggestion"("menuItemId", "suggestedItemId");

-- AddForeignKey
ALTER TABLE "public"."MenuItemSuggestion" ADD CONSTRAINT "MenuItemSuggestion_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "public"."MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MenuItemSuggestion" ADD CONSTRAINT "MenuItemSuggestion_suggestedItemId_fkey" FOREIGN KEY ("suggestedItemId") REFERENCES "public"."MenuItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
