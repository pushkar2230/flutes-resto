import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FoodType } from "@prisma/client";

export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({
      include: {
        category: true,
        variants: {
          orderBy: {
            displayOrder: "asc",
          },
        },
      },
      orderBy: [
        {
          category: {
            displayOrder: "asc",
          },
        },
        {
          displayOrder: "asc",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error) {
    console.error("ADMIN MENU GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load menu",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      description,
      price,
      foodType,
      categoryId,
      image,
      isAvailable = true,
      isBestSeller = false,
      isRecommended = false,
      displayOrder = 0,
    } = body;

    if (!name || !categoryId || price === undefined || !foodType) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, category, price and food type are required",
        },
        { status: 400 }
      );
    }

    if (!Object.values(FoodType).includes(foodType)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid food type",
        },
        { status: 400 }
      );
    }

    const item = await prisma.menuItem.create({
      data: {
        name: String(name).trim(),
        description: description
          ? String(description).trim()
          : null,
        price,
        foodType,
        categoryId,
        image: image || null,
        isAvailable,
        isBestSeller,
        isRecommended,
        displayOrder,
      },
      include: {
        category: true,
        variants: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        item,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADMIN MENU POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create menu item",
      },
      { status: 500 }
    );
  }
}