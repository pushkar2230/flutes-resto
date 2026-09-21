import { PrismaClient, FoodType } from "@prisma/client";

const prisma = new PrismaClient();

const soupItems = [
    {
        name: "Manchow Soup",
        price: 249,
        foodType: FoodType.VEG,
        variants: [
            { name: "Veg", price: 249, foodType: FoodType.VEG },
            { name: "Chicken", price: 269, foodType: FoodType.NON_VEG },
            { name: "Prawns", price: 299, foodType: FoodType.NON_VEG },
        ],
    },
    {
        name: "Hot & Sour",
        price: 249,
        foodType: FoodType.VEG,
        variants: [
            { name: "Veg", price: 249, foodType: FoodType.VEG },
            { name: "Chicken", price: 269, foodType: FoodType.NON_VEG },
            { name: "Prawns", price: 299, foodType: FoodType.NON_VEG },
        ],
    },
    {
        name: "Sweetcorn",
        price: 249,
        foodType: FoodType.VEG,
        variants: [
            { name: "Veg", price: 249, foodType: FoodType.VEG },
            { name: "Chicken", price: 269, foodType: FoodType.NON_VEG },
            { name: "Prawns", price: 299, foodType: FoodType.NON_VEG },
        ],
    },
    {
        name: "Clear Soup",
        price: 249,
        foodType: FoodType.VEG,
        variants: [
            { name: "Veg", price: 249, foodType: FoodType.VEG },
            { name: "Chicken", price: 269, foodType: FoodType.NON_VEG },
            { name: "Prawns", price: 299, foodType: FoodType.NON_VEG },
        ],
    },
    {
        name: "Cream Of",
        price: 269,
        foodType: FoodType.VEG,
        variants: [
            { name: "Veg", price: 269, foodType: FoodType.VEG },
            { name: "Chicken", price: 289, foodType: FoodType.NON_VEG },
            { name: "Prawns", price: 299, foodType: FoodType.NON_VEG },
        ],
    },
    {
        name: "Shorba",
        price: 249,
        foodType: FoodType.VEG,
        variants: [
            { name: "Veg", price: 249, foodType: FoodType.VEG },
            { name: "Chicken", price: 269, foodType: FoodType.NON_VEG },
            { name: "Prawns", price: 299, foodType: FoodType.NON_VEG },
        ],
    },
    {
        name: "Wanton",
        price: 249,
        foodType: FoodType.VEG,
        variants: [
            { name: "Veg", price: 249, foodType: FoodType.VEG },
            { name: "Chicken", price: 269, foodType: FoodType.NON_VEG },
            { name: "Prawns", price: 299, foodType: FoodType.NON_VEG },
        ],
    },
    {
        name: "Tom Yum",
        price: 249,
        foodType: FoodType.VEG,
        variants: [
            { name: "Veg", price: 249, foodType: FoodType.VEG },
            { name: "Chicken", price: 269, foodType: FoodType.NON_VEG },
            { name: "Prawns", price: 299, foodType: FoodType.NON_VEG },
        ],
    },
    {
        name: "Thai Spice",
        price: 269,
        foodType: FoodType.VEG,
        variants: [
            { name: "Veg", price: 269, foodType: FoodType.VEG },
            { name: "Chicken", price: 289, foodType: FoodType.NON_VEG },
            { name: "Prawns", price: 299, foodType: FoodType.NON_VEG },
        ],
    },
    {
        name: "Rosted Almond Broccoli Soup",
        price: 299,
        foodType: FoodType.VEG,
        variants: [],
    },
    {
        name: "Tomkha",
        price: 269,
        foodType: FoodType.VEG,
        variants: [
            { name: "Veg", price: 269, foodType: FoodType.VEG },
            { name: "Chicken", price: 289, foodType: FoodType.NON_VEG },
            { name: "Prawns", price: 299, foodType: FoodType.NON_VEG },
        ],
    },
    {
        name: "Lung Fung",
        price: 249,
        foodType: FoodType.VEG,
        variants: [
            { name: "Veg", price: 249, foodType: FoodType.VEG },
            { name: "Chicken", price: 269, foodType: FoodType.NON_VEG },
            { name: "Prawns", price: 299, foodType: FoodType.NON_VEG },
        ],
    },
];

async function main() {
    console.log("🍲 Updating Flutes Soup menu...");

    const category = await prisma.category.findFirst({
        where: {
            name: "Soup Veg/Non-Veg",
        },
    });

    if (!category) {
        throw new Error(
            'Category "Soup Veg/Non-Veg" not found.'
        );
    }

    console.log(`✅ Category found: ${category.name}`);

    for (let index = 0; index < soupItems.length; index++) {
        const soup = soupItems[index];

        const item = await prisma.menuItem.findFirst({
            where: {
                categoryId: category.id,
                name: soup.name,
            },
        });

        let menuItem = item;

        if (!menuItem) {
            menuItem = await prisma.menuItem.create({
                data: {
                    categoryId: category.id,
                    name: soup.name,
                    price: soup.price,
                    foodType: soup.foodType,
                    displayOrder: index,
                    isAvailable: true,
                },
            });

            console.log(`➕ Created: ${soup.name}`);
        } else {
            menuItem = await prisma.menuItem.update({
                where: {
                    id: menuItem.id,
                },
                data: {
                    price: soup.price,
                    foodType: soup.foodType,
                    displayOrder: index,
                    isAvailable: true,
                },
            });

            console.log(`🔄 Updated: ${soup.name}`);
        }

        /*
         * Remove old variants for this soup.
         * The menu item itself is preserved.
         */
        await prisma.menuItemVariant.deleteMany({
            where: {
                menuItemId: menuItem.id,
            },
        });

        /*
         * Re-create only the variants that belong
         * to the final menu structure.
         */
        if (soup.variants.length > 0) {
            await prisma.menuItemVariant.createMany({
                data: soup.variants.map((variant, variantIndex) => ({
                    menuItemId: menuItem.id,
                    name: variant.name,
                    price: variant.price,
                    foodType: variant.foodType,
                    displayOrder: variantIndex,
                    isAvailable: true,
                })),
            });
        }
    }

    /*
     * Keep only the 12 menu items from the actual
     * Soup section.
     *
     * Any accidental extra soup item is disabled
     * instead of being deleted.
     */
    await prisma.menuItem.updateMany({
        where: {
            categoryId: category.id,
            name: {
                notIn: soupItems.map((item) => item.name),
            },
        },
        data: {
            isAvailable: false,
        },
    });

    console.log("");
    console.log("🎉 Soup menu updated successfully!");
    console.log(`🍲 Items processed: ${soupItems.length}`);
}

main()
    .catch((error) => {
        console.error("❌ Soup update failed:");
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });     