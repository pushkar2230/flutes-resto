import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🍲 Inspecting Soup menu...\n");

    const category = await prisma.category.findFirst({
        where: {
            name: "Soup Veg/Non-Veg",
        },
    });

    if (!category) {
        throw new Error('Category "Soup Veg/Non-Veg" not found.');
    }

    const items = await prisma.menuItem.findMany({
        where: {
            categoryId: category.id,
        },
        orderBy: {
            displayOrder: "asc",
        },
        include: {
            variants: {
                orderBy: {
                    displayOrder: "asc",
                },
            },
        },
    });

    console.log(`Category: ${category.name}`);
    console.log(`Category ID: ${category.id}`);
    console.log(`Total Soup MenuItems: ${items.length}`);
    console.log("");

    const grouped = new Map<
        string,
        typeof items
    >();

    for (const item of items) {
        const existing = grouped.get(item.name) ?? [];

        existing.push(item);

        grouped.set(item.name, existing);
    }

    for (const [name, group] of grouped) {
        console.log("========================================");
        console.log(`🍲 ${name}`);
        console.log(`Count: ${group.length}`);

        if (group.length > 1) {
            console.log("⚠️ DUPLICATE FOUND");
        }

        for (const item of group) {
            console.log("");
            console.log(`ID: ${item.id}`);
            console.log(`Price: ₹${item.price}`);
            console.log(`Food Type: ${item.foodType}`);
            console.log(`Available: ${item.isAvailable}`);
            console.log(`Display Order: ${item.displayOrder}`);

            console.log("Variants:");

            if (item.variants.length === 0) {
                console.log("  - None");
            } else {
                for (const variant of item.variants) {
                    console.log(
                        `  - ${variant.name} | ₹${variant.price} | ${variant.foodType} | ${variant.isAvailable}`
                    );
                }
            }
        }
    }

    console.log("");
    console.log("========================================");
    console.log("✅ Inspection completed.");
}

main()
    .catch((error) => {
        console.error("❌ Inspection failed:");
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });