-- AlterTable
ALTER TABLE "public"."MenuItemVariant" ADD COLUMN     "foodType" "public"."FoodType";

-- CreateIndex
CREATE INDEX "MenuItemVariant_foodType_idx" ON "public"."MenuItemVariant"("foodType");
