import { NextResponse } from "next/server";
import { PrismaClient, Prisma, OrderType } from "@prisma/client";
import crypto from "crypto";

const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient;
};

const prisma =
    globalForPrisma.prisma ??
    new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

type OrderRequestItem = {
    menuItemId: string;
    variantId?: string | null;
    quantity: number;
};

type OrderRequest = {
    orderType: "TAKEAWAY" | "DELIVERY";

    customerName: string;
    customerPhone: string;
    customerEmail?: string;

    customerAddress?: string;
    landmark?: string;
    pincode?: string;

    customerLatitude?: number;
    customerLongitude?: number;

    notes?: string;

    items: OrderRequestItem[];
};

function money(value: Prisma.Decimal | number | string) {
    return new Prisma.Decimal(value).toDecimalPlaces(2);
}

function generateOrderNumber() {
    const date = new Date();

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    const random = crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase();

    return `FLT-${yyyy}${mm}${dd}-${random}`;
}

function generateHandoverCode() {
    return crypto.randomInt(100000, 1000000).toString();
}

function generateAccessToken() {
    return crypto.randomBytes(32).toString("hex");
}

function calculateDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
) {
    const earthRadiusKm = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as OrderRequest;

        /* -----------------------------
           BASIC VALIDATION
        ----------------------------- */

        if (!body || !Array.isArray(body.items) || body.items.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Your cart is empty.",
                },
                { status: 400 }
            );
        }

        if (
            body.orderType !== OrderType.TAKEAWAY &&
            body.orderType !== OrderType.DELIVERY
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid order type.",
                },
                { status: 400 }
            );
        }

        if (!body.customerName?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Customer name is required.",
                },
                { status: 400 }
            );
        }

        if (!body.customerPhone?.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Customer phone number is required.",
                },
                { status: 400 }
            );
        }

        if (body.orderType === OrderType.DELIVERY) {
            if (!body.customerAddress?.trim()) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Delivery address is required.",
                    },
                    { status: 400 }
                );
            }

            if (
                typeof body.customerLatitude !== "number" ||
                typeof body.customerLongitude !== "number"
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Location is required for delivery.",
                    },
                    { status: 400 }
                );
            }
        }

        /* -----------------------------
           RESTAURANT SETTINGS
        ----------------------------- */

        const restaurant = await prisma.restaurantSetting.findFirst({
            orderBy: {
                createdAt: "asc",
            },
        });

        const deliveryRadius = restaurant?.deliveryRadius ?? 4;

        /* -----------------------------
           DELIVERY DISTANCE CHECK
        ----------------------------- */

        let distanceKm: number | null = null;

        if (body.orderType === OrderType.DELIVERY) {
            if (
                !restaurant?.latitude ||
                !restaurant?.longitude
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Restaurant location is not configured for delivery.",
                    },
                    { status: 400 }
                );
            }

            distanceKm = calculateDistanceKm(
                Number(restaurant.latitude),
                Number(restaurant.longitude),
                body.customerLatitude!,
                body.customerLongitude!
            );

            if (distanceKm > deliveryRadius) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Delivery is available only within ${deliveryRadius} km.`,
                        distanceKm: Number(distanceKm.toFixed(2)),
                        deliveryRadius,
                    },
                    { status: 400 }
                );
            }
        }

        /* -----------------------------
           FETCH MENU ITEMS
        ----------------------------- */

        const menuItemIds = [
            ...new Set(
                body.items.map((item) => item.menuItemId)
            ),
        ];

        const menuItems = await prisma.menuItem.findMany({
            where: {
                id: {
                    in: menuItemIds,
                },
                isAvailable: true,
            },
            select: {
                id: true,
                name: true,
                price: true,
                variants: {
                    where: {
                        isAvailable: true,
                    },
                    select: {
                        id: true,
                        name: true,
                        price: true,
                    },
                },
            },
        });

        const menuMap = new Map(
            menuItems.map((item) => [item.id, item])
        );

        /* -----------------------------
           BUILD ORDER ITEMS
        ----------------------------- */

        const orderItems: {
            menuItemId: string;
            variantId: string | null;
            itemName: string;
            variantName: string | null;
            quantity: number;
            price: Prisma.Decimal;
        }[] = [];

        let subtotal = new Prisma.Decimal(0);

        for (const cartItem of body.items) {
            if (
                !Number.isInteger(cartItem.quantity) ||
                cartItem.quantity <= 0 ||
                cartItem.quantity > 50
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid item quantity.",
                    },
                    { status: 400 }
                );
            }

            const menuItem = menuMap.get(cartItem.menuItemId);

            if (!menuItem) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "One or more menu items are unavailable.",
                    },
                    { status: 400 }
                );
            }

            let itemPrice: Prisma.Decimal | null = null;
            let variantName: string | null = null;
            let variantId: string | null = null;

            if (menuItem.variants.length > 0) {
                if (!cartItem.variantId) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: `${menuItem.name} requires a variant selection.`,
                        },
                        { status: 400 }
                    );
                }

                const variant = menuItem.variants.find(
                    (v) => v.id === cartItem.variantId
                );

                if (!variant) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: `Selected variant for ${menuItem.name} is unavailable.`,
                        },
                        { status: 400 }
                    );
                }

                itemPrice = new Prisma.Decimal(variant.price);
                variantName = variant.name;
                variantId = variant.id;
            } else {
                if (cartItem.variantId) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: `Invalid variant for ${menuItem.name}.`,
                        },
                        { status: 400 }
                    );
                }

                if (menuItem.price === null) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: `${menuItem.name} does not have a valid price.`,
                        },
                        { status: 400 }
                    );
                }

                itemPrice = new Prisma.Decimal(menuItem.price);
            }

            const lineTotal = itemPrice.mul(cartItem.quantity);

            subtotal = subtotal.add(lineTotal);

            orderItems.push({
                menuItemId: menuItem.id,
                variantId,
                itemName: menuItem.name,
                variantName,
                quantity: cartItem.quantity,
                price: money(itemPrice),
            });
        }

        subtotal = money(subtotal);

        /* -----------------------------
           TAX
        ----------------------------- */

        const gstEnabled = restaurant?.gstEnabled ?? true;

        const cgstRate = restaurant
            ? new Prisma.Decimal(restaurant.cgstRate)
            : new Prisma.Decimal("2.5");

        const sgstRate = restaurant
            ? new Prisma.Decimal(restaurant.sgstRate)
            : new Prisma.Decimal("2.5");

        let cgst = new Prisma.Decimal(0);
        let sgst = new Prisma.Decimal(0);

        if (gstEnabled) {
            cgst = money(
                subtotal.mul(cgstRate).div(100)
            );

            sgst = money(
                subtotal.mul(sgstRate).div(100)
            );
        }

        const tax = money(cgst.add(sgst));

        /* -----------------------------
           DELIVERY FEE
           Currently ₹0
        ----------------------------- */

        const deliveryFee = new Prisma.Decimal(0);

        const total = money(
            subtotal
                .add(tax)
                .add(deliveryFee)
        );

        /* -----------------------------
           CREATE ORDER
        ----------------------------- */

        let orderNumber = generateOrderNumber();

        const handoverCode = generateHandoverCode();
        const accessToken = generateAccessToken();

        const order = await prisma.$transaction(async (tx) => {
            let createdOrder:
                Awaited<ReturnType<typeof tx.order.create>> | null = null;

            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    createdOrder = await tx.order.create({
                        data: {
                            orderNumber,
                            accessToken,

                            orderType: body.orderType,
                            status: "PENDING",

                            subtotal,
                            cgst,
                            sgst,
                            tax,
                            deliveryFee,
                            total,

                            paymentStatus: "PENDING",

                            customerName: body.customerName.trim(),
                            customerPhone: body.customerPhone.trim(),

                            customerEmail:
                                body.customerEmail?.trim() || null,

                            customerAddress:
                                body.customerAddress?.trim() || null,

                            landmark:
                                body.landmark?.trim() || null,

                            pincode:
                                body.pincode?.trim() || null,

                            customerLatitude:
                                body.customerLatitude ?? null,

                            customerLongitude:
                                body.customerLongitude ?? null,

                            notes:
                                body.notes?.trim() || null,

                            handoverCode,
                            handoverStatus: "PENDING",

                            items: {
                                create: orderItems,
                            },
                        },
                    });

                    break;
                } catch (error) {
                    if (
                        attempt === 2 ||
                        !(
                            error instanceof
                            Prisma.PrismaClientKnownRequestError
                        ) ||
                        error.code !== "P2002"
                    ) {
                        throw error;
                    }

                    orderNumber = generateOrderNumber();
                }
            }

            if (!createdOrder) {
                throw new Error("Failed to create order.");
            }

            return createdOrder;
        });

        return NextResponse.json({
            success: true,

            order: {
                ...order,

                subtotal: Number(order.subtotal),
                cgst: Number(order.cgst),
                sgst: Number(order.sgst),
                tax: Number(order.tax),
                deliveryFee: Number(order.deliveryFee),
                total: Number(order.total),
            },

            distanceKm:
                distanceKm !== null
                    ? Number(distanceKm.toFixed(2))
                    : null,
        });
    } catch (error) {
        console.error("ORDER CREATE ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create order.",
            },
            { status: 500 }
        );
    }
}