import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const itemIds = searchParams
      .get("itemIds")
      ?.split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (!itemIds || itemIds.length === 0) {
      return NextResponse.json({
        success: true,
        items: [],
      });
    }

    const suggestions =
      await prisma.menuItemSuggestion.findMany({
        where: {
          menuItemId: {
            in: itemIds,
          },

          isActive: true,

          suggestedItem: {
            isAvailable: true,
          },
        },

        orderBy: {
          priority: "desc",
        },

        include: {
          suggestedItem: {
            include: {
              category: true,

              variants: {
                where: {
                  isAvailable: true,
                },

                orderBy: {
                  price: "asc",
                },
              },
            },
          },
        },
      });

    /*
     * Remove duplicate suggested items.
     *
     * Example:
     *
     * Chicken 65
     *    ↓
     * Garlic Bread
     *
     * Biryani
     *    ↓
     * Garlic Bread
     *
     * Garlic Bread should appear only once.
     */

    const uniqueItems = new Map<
      string,
      {
        id: string;
        name: string;
        description: string | null;
        price: number;
        image: string | null;
        foodType: string;
        isBestSeller: boolean;
        isRecommended: boolean;
        categoryName: string | null;
        variants: {
          id: string;
          name: string;
          price: number;
          isAvailable: boolean;
        }[];
      }
    >();

    for (const suggestion of suggestions) {
      const item = suggestion.suggestedItem;

      if (uniqueItems.has(item.id)) {
        continue;
      }

      uniqueItems.set(item.id, {
        id: item.id,
        name: item.name,
        description: item.description,
        price: Number(item.price ?? 0),
        image: item.image,
        foodType: item.foodType,
        isBestSeller: item.isBestSeller,
        isRecommended: item.isRecommended,

        categoryName:
          item.category?.name ?? null,

        variants: item.variants.map((variant) => ({
          id: variant.id,
          name: variant.name,
          price: Number(variant.price),
          isAvailable: variant.isAvailable,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      items: Array.from(uniqueItems.values()),
    });
  } catch (error) {
    console.error(
      "SUGGESTIONS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        items: [],
        error: "Failed to load suggestions",
      },
      {
        status: 500,
      }
    );
  } finally {
    await prisma.$disconnect();
  }
}