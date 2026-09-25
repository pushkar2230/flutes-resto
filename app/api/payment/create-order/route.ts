import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

export async function POST(request: Request) {
    try {
        if (!keyId || !keySecret) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Razorpay is not configured.",
                },
                { status: 500 }
            );
        }

        const body = await request.json();

        const amount = Number(body.amount);
        const receipt = String(body.receipt || "").trim();

        if (!Number.isFinite(amount) || amount <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid payment amount.",
                },
                { status: 400 }
            );
        }

        if (!receipt) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Payment receipt is required.",
                },
                { status: 400 }
            );
        }

        const razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt,
            notes: {
                source: "flutes-resto",
            },
        });

        return NextResponse.json({
            success: true,
            order: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
            },
            keyId,
        });
    } catch (error) {
        console.error("RAZORPAY CREATE ORDER ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to create payment order.",
            },
            { status: 500 }
        );
    }
}