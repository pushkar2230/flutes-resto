import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  "Soup",
  "Quick Bites",
  "Asian Veg Appetizer",
  "Asian Non-Veg Appetizer",
  "Charcoal Grill Veg",
  "Charcoal Grill Non-Veg",
  "Sea-Food Special",
  "Mini Pizza / Pasta",
  "Indian Veg Main Course",
  "Indian Non-Veg Main Course",
  "Assorted Breads",
  "Asian Main Course",
  "Sizzlers",
  "Thai",
  "Biryani",
  "Rice, Dal & Raita",
  "Sandwiches",
  "Shakes / Smoothies",
  "Beverages",
];

async function main() {
  for (const [index, name] of categories.entries()) {
    await prisma.category.upsert({
      where: { name },
      update: {
        displayOrder: index + 1,
        isActive: true,
      },
      create: {
        name,
        displayOrder: index + 1,
        isActive: true,
      },
    });
  }

  console.log("Flutes food categories created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });