import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 CLEANING MENU DATA");
  console.log("=====================");

  const suggestions = await prisma.menuItemSuggestion.deleteMany();
  console.log(`✓ Suggestions deleted: ${suggestions.count}`);

  const variants = await prisma.menuItemVariant.deleteMany();
  console.log(`✓ Variants deleted: ${variants.count}`);

  const items = await prisma.menuItem.deleteMany();
  console.log(`✓ Menu items deleted: ${items.count}`);

  const categories = await prisma.category.deleteMany();
  console.log(`✓ Categories deleted: ${categories.count}`);

  console.log("\n✅ MENU DATA CLEANED");
  console.log("Orders/Admin/Banners/Settings were NOT touched.");
}

main()
  .catch((error) => {
    console.error("\n❌ CLEANUP FAILED");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });