import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true,
        variants: {
          orderBy: {
            displayOrder: "asc",
          },
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          message: "Menu item not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("MENU ITEM GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load menu item",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Menu item not found",
        },
        { status: 404 }
      );
    }

    const item = await prisma.menuItem.update({
      where: { id },
      data: {
        ...(body.name !== undefined && {
          name: String(body.name).trim(),
        }),

        ...(body.description !== undefined && {
          description: body.description
            ? String(body.description).trim()
            : null,
        }),

        ...(body.price !== undefined && {
          price: body.price,
        }),

        ...(body.foodType !== undefined && {
          foodType: body.foodType,
        }),

        ...(body.categoryId !== undefined && {
          categoryId: body.categoryId,
        }),

        ...(body.image !== undefined && {
          image: body.image,
        }),

        ...(body.isAvailable !== undefined && {
          isAvailable: Boolean(body.isAvailable),
        }),

        ...(body.isBestSeller !== undefined && {
          isBestSeller: Boolean(body.isBestSeller),
        }),

        ...(body.isRecommended !== undefined && {
          isRecommended: Boolean(body.isRecommended),
        }),

        ...(body.displayOrder !== undefined && {
          displayOrder: Number(body.displayOrder),
        }),
      },
      include: {
        category: true,
        variants: true,
      },
    });

    return NextResponse.json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("MENU ITEM PATCH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update menu item",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const existing = await prisma.menuItem.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Menu item not found",
        },
        { status: 404 }
      );
    }

    await prisma.menuItem.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Menu item deleted",
    });
  } catch (error) {
    console.error("MENU ITEM DELETE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete menu item",
      },
      { status: 500 }
    );
  }
}