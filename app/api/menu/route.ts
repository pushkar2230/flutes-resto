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
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,

        // Empty categories customer side ला पाठवायच्या नाहीत
        menuItems: {
          some: {
            isAvailable: true,
          },
        },
      },

      orderBy: {
        displayOrder: "asc",
      },

      select: {
        id: true,
        name: true,
        image: true,
        displayOrder: true,

        menuItems: {
          where: {
            isAvailable: true,
          },

          orderBy: {
            displayOrder: "asc",
          },

          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            image: true,
            foodType: true,
            isBestSeller: true,
            isRecommended: true,

            variants: {
              where: {
                isAvailable: true,
              },

              orderBy: {
                displayOrder: "asc",
              },

              select: {
                id: true,
                name: true,
                price: true,
                isAvailable: true,
              },
            },
          },
        },
      },
    });

    const menu = categories.map((category) => ({
      id: category.id,
      name: category.name,
      image: category.image,
      displayOrder: category.displayOrder,

      items: category.menuItems.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: Number(item.price ?? 0),
        image: item.image,
        foodType: item.foodType,
        isBestSeller: item.isBestSeller,
        isRecommended: item.isRecommended,

        variants: item.variants.map((variant) => ({
          id: variant.id,
          name: variant.name,
          price: Number(variant.price),
          isAvailable: variant.isAvailable,
        })),
      })),
    }));

    return NextResponse.json(
      {
        success: true,
        categories: menu,
      },
      {
        headers: {
          // Browser ला short time cache करू दे
          "Cache-Control":
            "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("MENU API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load menu",
      },
      {
        status: 500,
      }
    );
  }
}