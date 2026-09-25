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

function calculateDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
) {
    const earthRadiusKm = 6371;

    const dLat =
        ((lat2 - lat1) * Math.PI) / 180;

    const dLon =
        ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return earthRadiusKm * c;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const latitude = Number(body.latitude);
        const longitude = Number(body.longitude);

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid location.",
                },
                { status: 400 }
            );
        }

        const restaurant =
            await prisma.restaurantSetting.findFirst({
                select: {
                    latitude: true,
                    longitude: true,
                    deliveryRadius: true,
                    isOpen: true,
                },
            });

        if (
            !restaurant ||
            restaurant.latitude === null ||
            restaurant.longitude === null
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Restaurant delivery location is not configured.",
                },
                { status: 503 }
            );
        }

        const distanceKm = calculateDistanceKm(
            Number(restaurant.latitude),
            Number(restaurant.longitude),
            latitude,
            longitude
        );

        const radiusKm =
            Number(restaurant.deliveryRadius || 4);

        const eligible =
            distanceKm <= radiusKm;

        return NextResponse.json({
            success: true,
            eligible,
            distanceKm: Number(
                distanceKm.toFixed(2)
            ),
            radiusKm,
        });
    } catch (error) {
        console.error(
            "DELIVERY CHECK ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to check delivery availability.",
            },
            { status: 500 }
        );
    }
}