import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json({
        success: true,
        items: [],
      });
    }

    const ids = idsParam
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (ids.length === 0) {
      return NextResponse.json({
        success: true,
        items: [],
      });
    }

    const suggestions =
      await prisma.menuItemSuggestion.findMany({
        where: {
          menuItemId: {
            in: ids,
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

    // Remove duplicates when multiple cart items
    // recommend the same product.
    const uniqueItems = new Map();

    for (const suggestion of suggestions) {
      const item = suggestion.suggestedItem;

      if (!uniqueItems.has(item.id)) {
        uniqueItems.set(item.id, {
          id: item.id,
          name: item.name,
          description: item.description,
          price: Number(item.price ?? 0),
          image: item.image,
          foodType: item.foodType,
          variants: item.variants.map((variant) => ({
            id: variant.id,
            name: variant.name,
            price: Number(variant.price),
            isAvailable: variant.isAvailable,
          })),
        });
      }
    }

    // Don't recommend items already in cart.
    const cartIds = new Set(ids);

    const items = Array.from(uniqueItems.values()).filter(
      (item) => !cartIds.has(item.id)
    );

    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error) {
    console.error(
      "MENU SUGGESTIONS API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        items: [],
        error: "Failed to load suggestions",
      },
      { status: 500 }
    );
  }
}