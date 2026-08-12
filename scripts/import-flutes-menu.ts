import { PrismaClient, FoodType } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

type MenuVariant = {
  name: string;
  price: number;
  foodType?: "VEG" | "NON_VEG";
};

type MenuItem = {
  name: string;
  description?: string;
  price?: number;
  foodType: "VEG" | "NON_VEG";
  variants?: MenuVariant[];
};

type MenuCategory = {
  name: string;
  displayOrder: number;
  items: MenuItem[];
};

type MenuData = {
  categories: MenuCategory[];
};

async function main() {
  const filePath = path.join(
    process.cwd(),
    "data",
    "flutes-menu.json"
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`Menu file not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const menu: MenuData = JSON.parse(raw);

  console.log("\n🍽️ FLUTES MENU IMPORT");
  console.log("======================\n");

  for (const categoryData of menu.categories) {
    const category = await prisma.category.upsert({
      where: {
        name: categoryData.name,
      },

      update: {
        displayOrder: categoryData.displayOrder,
        isActive: true,
      },

      create: {
        name: categoryData.name,
        displayOrder: categoryData.displayOrder,
        isActive: true,
      },
    });

    console.log(`📂 ${category.name}`);

    for (
      let itemIndex = 0;
      itemIndex < categoryData.items.length;
      itemIndex++
    ) {
      const itemData = categoryData.items[itemIndex];

      const existingItem = await prisma.menuItem.findFirst({
        where: {
          categoryId: category.id,
          name: itemData.name,
        },
      });

      const item = existingItem
        ? await prisma.menuItem.update({
            where: {
              id: existingItem.id,
            },

            data: {
              description: itemData.description,
              price: itemData.price ?? 0,
              foodType:
                itemData.foodType === "VEG"
                  ? FoodType.VEG
                  : FoodType.NON_VEG,
              displayOrder: itemIndex,
            },
          })
        : await prisma.menuItem.create({
            data: {
              categoryId: category.id,
              name: itemData.name,
              description: itemData.description,
              price: itemData.price ?? 0,
              foodType:
                itemData.foodType === "VEG"
                  ? FoodType.VEG
                  : FoodType.NON_VEG,
              displayOrder: itemIndex,
              isAvailable: true,
            },
          });

      /*
       * Replace variants safely.
       * This means rerunning the importer will NOT
       * create duplicate variants.
       */
      await prisma.menuItemVariant.deleteMany({
        where: {
          menuItemId: item.id,
        },
      });

      if (itemData.variants?.length) {
        await prisma.menuItemVariant.createMany({
          data: itemData.variants.map(
            (variant, variantIndex) => ({
              menuItemId: item.id,

              name: variant.name,

              price: variant.price,

              foodType:
                variant.foodType === "VEG"
                  ? FoodType.VEG
                  : variant.foodType === "NON_VEG"
                  ? FoodType.NON_VEG
                  : itemData.foodType === "VEG"
                  ? FoodType.VEG
                  : FoodType.NON_VEG,

              displayOrder: variantIndex,

              isAvailable: true,
            })
          ),
        });
      }

      console.log(`   ✓ ${itemData.name}`);
    }
  }

  console.log("\n✅ MENU IMPORT COMPLETED");
}

main()
  .catch((error) => {
    console.error("\n❌ IMPORT FAILED\n");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });