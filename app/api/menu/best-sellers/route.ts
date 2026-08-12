import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({
      where: {
        isBestSeller: true,
        isAvailable: true,
      },
      include: {
        category: true,
        variants: {
          where: {
            isAvailable: true,
          },
          orderBy: {
            displayOrder: "asc",
          },
        },
      },
      orderBy: {
        displayOrder: "asc",
      },
      take: 10,
    });

    const formattedItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      image: item.image,
      foodType: item.foodType,
      categoryId: item.categoryId,
      categoryName: item.category.name,
      isBestSeller: item.isBestSeller,
      isRecommended: item.isRecommended,

      variants: item.variants.map((variant) => ({
        id: variant.id,
        name: variant.name,
        price: Number(variant.price),
        isAvailable: variant.isAvailable,
      })),
    }));

    return NextResponse.json({
      success: true,
      items: formattedItems,
    });
  } catch (error) {
    console.error("BEST SELLERS API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load best sellers",
      },
      { status: 500 }
    );
  }
}