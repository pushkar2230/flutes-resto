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
      },
      orderBy: {
        displayOrder: "asc",
      },
      select: {
        id: true,
        name: true,
        image: true,
        displayOrder: true,
      },
    });

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("CATEGORIES API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load categories",
      },
      { status: 500 }
    );
  }
}