"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    Check,
    ChevronDown,
    Loader2,
    MapPin,
    Mail,
    Phone,
    ShoppingBag,
    Truck,
    User,
} from "lucide-react";

type OrderType = "DELIVERY" | "TAKEAWAY";

type CartItem = {
    cartId: string;
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string | null;
    foodType?: string;
    variantId?: string;
    variantName?: string;
};

type CreatedOrder = {
    id: string;
    orderNumber: string;
    accessToken?: string;
    orderType: OrderType;
    status: string;
    subtotal: number;
    cgst: number;
    sgst: number;
    tax: number;
    deliveryFee: number;
    total: number;
    paymentStatus?: string;
    createdAt?: string;
};

const GSTIN = "27AAFFF7787C1Z6";
const VAT_NO = "27921630594V";

export default function CheckoutPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);

    const [orderType, setOrderType] =
        useState<OrderType | null>(null);

    const [locationChecked, setLocationChecked] = useState(false);

    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");

    const [customerAddress, setCustomerAddress] =
        useState("");

    const [landmark, setLandmark] = useState("");
    const [pincode, setPincode] = useState("");

    const [customerLatitude, setCustomerLatitude] =
        useState<number | null>(null);

    const [customerLongitude, setCustomerLongitude] =
        useState<number | null>(null);

    const [locationLoading, setLocationLoading] =
        useState(false);

    const [successOrder, setSuccessOrder] =
        useState<CreatedOrder | null>(null);

    const [errorMessage, setErrorMessage] =
        useState("");

    /*
     * Delivery is intentionally disabled until the restaurant
     * location is configured in RestaurantSetting.
     *
     * Backend still performs the real 4 km validation.
     */
    const [deliveryEligible, setDeliveryEligible] = useState(false);
    const [checkingDelivery, setCheckingDelivery] = useState(false);
    const [distanceKm, setDistanceKm] = useState<number | null>(null);
    const [locationError, setLocationError] = useState("");

    const checkDeliveryLocation = () => {
        if (!navigator.geolocation) {
            setDeliveryEligible(false);
            setDistanceKm(null);
            setOrderType("TAKEAWAY");
            setLocationChecked(true);
            setLocationError(
                "Location access is not supported on this device. You can continue with Takeaway."
            );
            return;
        }

        setCheckingDelivery(true);
        setLocationChecked(false);
        setLocationError("");
        setErrorMessage("");

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                setCustomerLatitude(latitude);
                setCustomerLongitude(longitude);

                try {
                    const response = await fetch("/api/delivery/check", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            latitude,
                            longitude,
                        }),
                    });

                    const data = await response.json();

                    if (!response.ok || !data.success) {
                        setDeliveryEligible(false);
                        setDistanceKm(null);
                        setOrderType("TAKEAWAY");
                        setLocationChecked(true);
                        setLocationError(
                            data.message ||
                            "We couldn't verify your delivery location. You can continue with Takeaway."
                        );
                        return;
                    }

                    const eligible = Boolean(data.eligible);

                    setDeliveryEligible(eligible);
                    setDistanceKm(data.distanceKm);
                    setLocationChecked(true);

                    if (eligible) {
                        setOrderType("DELIVERY");
                        setLocationError("");
                    } else {
                        setOrderType("TAKEAWAY");
                        setLocationError(
                            `You're ${data.distanceKm} km away from Flutes. Delivery is available within 4 km, so Takeaway has been selected.`
                        );
                    }
                } catch (error) {
                    console.error(
                        "DELIVERY LOCATION CHECK ERROR:",
                        error
                    );

                    setDeliveryEligible(false);
                    setDistanceKm(null);
                    setOrderType("TAKEAWAY");
                    setLocationChecked(true);
                    setLocationError(
                        "Unable to verify your delivery location. You can continue with Takeaway or retry your location."
                    );
                } finally {
                    setCheckingDelivery(false);
                }
            },
            () => {
                setCheckingDelivery(false);
                setDeliveryEligible(false);
                setOrderType("TAKEAWAY");
                setLocationChecked(true);
                setLocationError(
                    "Location permission was not granted. Takeaway is available, or you can retry your location."
                );
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    };

    useEffect(() => {
        try {
            const raw = localStorage.getItem("flutes-cart");

            if (raw) {
                const parsed = JSON.parse(raw);

                if (Array.isArray(parsed)) {
                    setCart(parsed);
                }
            }
        } catch (error) {
            console.error("CHECKOUT CART ERROR:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const subtotal = useMemo(() => {
        return cart.reduce(
            (total, item) =>
                total +
                Number(item.price || 0) * Number(item.quantity || 0),
            0
        );
    }, [cart]);

    /*
     * Preview only.
     * Final tax is calculated securely by /api/orders
     * using RestaurantSetting.
     */
    const previewCgst = Number(
        ((subtotal * 2.5) / 100).toFixed(2)
    );

    const previewSgst = Number(
        ((subtotal * 2.5) / 100).toFixed(2)
    );

    const previewTax = previewCgst + previewSgst;

    const previewTotal = subtotal + previewTax;

    const handleOrderType = (type: OrderType) => {
        if (!locationChecked) return;
        if (type === "DELIVERY" && !deliveryEligible) return;

        setOrderType(type);
        setErrorMessage("");
    };

    const validateForm = () => {
        if (!locationChecked) {
            return "Please confirm your location first.";
        }

        if (!orderType) {
            return "Please confirm your order type.";
        }

        if (!customerName.trim()) {
            return "Please enter your full name.";
        }

        if (!/^[6-9]\d{9}$/.test(customerPhone.trim())) {
            return "Please enter a valid 10-digit mobile number.";
        }

        if (
            customerEmail.trim() &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                customerEmail.trim()
            )
        ) {
            return "Please enter a valid email address.";
        }

        if (orderType === "DELIVERY") {
            if (!customerAddress.trim()) {
                return "Please enter your delivery address.";
            }

            if (
                customerLatitude === null ||
                customerLongitude === null
            ) {
                return "Please select your delivery location.";
            }
        }

        return "";
    };

    const handlePlaceOrder = async () => {
        if (placingOrder) {
            return;
        }

        const validationError = validateForm();

        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        if (!orderType) {
            setErrorMessage("Please confirm your location first.");
            return;
        }

        setErrorMessage("");
        setPlacingOrder(true);

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderType,
                    customerName: customerName.trim(),
                    customerPhone: customerPhone.trim(),
                    customerEmail:
                        customerEmail.trim() || undefined,
                    customerAddress:
                        customerAddress.trim() || undefined,
                    landmark: landmark.trim() || undefined,
                    pincode: pincode.trim() || undefined,
                    customerLatitude:
                        customerLatitude ?? undefined,
                    customerLongitude:
                        customerLongitude ?? undefined,
                    items: cart.map((item) => ({
                        menuItemId: item.menuItemId,
                        variantId: item.variantId ?? null,
                        quantity: item.quantity,
                    })),
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Unable to create your order."
                );
            }

            const order = data.order as CreatedOrder;

            /*
             * Store only the access token locally.
             * This will later be used by /orders.
             */
            if (order.accessToken) {
                localStorage.setItem(
                    "flutes-order-access-token",
                    order.accessToken
                );
            }

            /*
             * Save order number separately for the customer.
             */
            localStorage.setItem(
                "flutes-last-order-number",
                order.orderNumber
            );

            localStorage.removeItem("flutes-cart");

            window.dispatchEvent(
                new Event("cart-updated")
            );

            setSuccessOrder(order);
        } catch (error) {
            console.error("PLACE ORDER ERROR:", error);

            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Something went wrong while placing your order."
            );
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#EDEFEA]">
                <div className="mx-auto flex min-h-screen w-full max-w-[480px] items-center justify-center bg-[#F7F8F6]">
                    <div className="flex flex-col items-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF2EE]">
                            <Loader2
                                size={24}
                                className="animate-spin text-[#0F5143]"
                            />
                        </div>

                        <p className="mt-4 text-sm font-semibold text-[#0F5143]">
                            Preparing your checkout...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (successOrder) {
        return (
            <SuccessScreen
                order={successOrder}
            />
        );
    }

    if (cart.length === 0) {
        return <EmptyCheckout />;
    }

    return (
        <main className="min-h-screen bg-[#E7ECE8] text-[#171A19] lg:px-6 lg:py-6">
            <div className="mx-auto min-h-screen w-full max-w-[520px] overflow-hidden bg-[#F7F8F6] pb-40 shadow-none lg:min-h-[calc(100vh-48px)] lg:rounded-[32px] lg:shadow-[0_24px_80px_rgba(15,63,53,0.12)]">

                {/* HEADER */}
                <header className="sticky top-0 z-40 border-b border-black/[0.05] bg-[#F7F8F6]/96 px-5 pb-3.5 pt-4 backdrop-blur-xl">
                    <div className="flex items-center gap-3">

                        <Link
                            href="/cart"
                            aria-label="Back to cart"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/[0.06] bg-white shadow-sm transition active:scale-95"
                        >
                            <ArrowLeft size={19} />
                        </Link>

                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#B77722]">
                                FLUTES RESTO
                            </p>

                            <h1 className="mt-0.5 text-[24px] font-extrabold tracking-[-0.04em]">
                                Checkout
                            </h1>
                        </div>

                    </div>
                </header>

                {/* PROGRESS */}
                <section className="px-5 pt-4">
                    <div className="rounded-[20px] border border-[#E2E8E4] bg-white px-4 py-3 shadow-[0_6px_20px_rgba(15,63,53,0.04)]">
                        <div className="flex items-center">

                            <ProgressStep
                                number="1"
                                label="Checkout"
                                active
                            />

                            <div className="mx-2 h-px flex-1 bg-[#DDE3DF]" />

                            <ProgressStep
                                number="2"
                                label="Payment"
                            />

                            <div className="mx-2 h-px flex-1 bg-[#DDE3DF]" />

                            <ProgressStep
                                number="3"
                                label="Done"
                            />

                        </div>
                    </div>
                </section>

                {/* HERO TITLE */}
                <section className="px-5 pt-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B77722]">
                        Almost there
                    </p>

                    <h2 className="mt-1 text-[25px] font-extrabold tracking-[-0.04em]">
                        Complete your order
                    </h2>

                    <p className="mt-1 text-[13px] leading-5 text-[#737A76]">
                        A few details and you're ready to go.
                    </p>
                </section>

                {/* LOCATION / ORDER TYPE */}
                <section className="px-5 pt-5">
                    <SectionTitle
                        number="1"
                        eyebrow="DELIVERY OPTIONS"
                        title="Where should we serve you?"
                    />

                    {!locationChecked && !checkingDelivery && (
                        <div className="mt-4 overflow-hidden rounded-[28px] border border-[#DCE6E0] bg-white shadow-[0_12px_34px_rgba(15,81,67,0.07)]">
                            <div className="bg-[#103F35] px-5 py-6 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                                        <MapPin size={25} />
                                    </div>

                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#D6A34A]">
                                            Step 1
                                        </p>
                                        <h3 className="mt-1 text-[19px] font-extrabold tracking-[-0.02em]">
                                            Confirm your location
                                        </h3>
                                    </div>
                                </div>

                                <p className="mt-5 text-[12px] leading-5 text-white/70">
                                    We'll check your distance from Flutes and
                                    automatically select Delivery or Takeaway.
                                </p>
                            </div>

                            <div className="p-5">
                                <div className="flex items-center justify-between rounded-2xl bg-[#F4F7F4] px-4 py-3">
                                    <div>
                                        <p className="text-[11px] font-bold text-[#103F35]">
                                            Delivery radius
                                        </p>
                                        <p className="mt-0.5 text-[10px] text-[#7A817D]">
                                            Available within 4 km
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-[#E4F1E9] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.06em] text-[#247A43]">
                                        Free Delivery
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={checkDeliveryLocation}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#103F35] px-5 py-3.5 text-[12px] font-bold text-white shadow-[0_9px_22px_rgba(16,63,53,0.18)] transition active:scale-[0.985]"
                                >
                                    <MapPin size={17} />
                                    Use My Location
                                </button>

                                <p className="mt-3 text-center text-[9px] leading-4 text-[#9A9F9B]">
                                    Your location is used only to check the
                                    restaurant's delivery radius.
                                </p>
                            </div>
                        </div>
                    )}

                    {checkingDelivery && (
                        <div className="mt-4 rounded-[28px] border border-[#DCE6E0] bg-white p-6 shadow-[0_12px_34px_rgba(15,81,67,0.07)]">
                            <div className="flex flex-col items-center text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EE] text-[#103F35]">
                                    <Loader2
                                        size={27}
                                        className="animate-spin"
                                    />
                                </div>

                                <p className="mt-5 text-[17px] font-extrabold text-[#171A19]">
                                    Checking your location
                                </p>

                                <p className="mt-2 max-w-[275px] text-[11px] leading-5 text-[#7A817D]">
                                    We're checking whether your location is
                                    within Flutes' 4 km delivery radius.
                                </p>

                                <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-[#E7ECE8]">
                                    <div className="h-full w-2/3 animate-pulse rounded-full bg-[#103F35]" />
                                </div>
                            </div>
                        </div>
                    )}

                    {locationChecked &&
                        !checkingDelivery &&
                        orderType === "DELIVERY" && (
                            <div className="mt-4 overflow-hidden rounded-[28px] border border-[#CFE4D7] bg-[#F5FBF7] shadow-[0_10px_28px_rgba(15,81,67,0.06)]">
                                <div className="p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#DFF1E7] text-[#0F5143]">
                                            <Truck size={23} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-[17px] font-extrabold text-[#0F5143]">
                                                    Delivery selected
                                                </h3>
                                                <span className="rounded-full bg-[#DFF1E7] px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#247A43]">
                                                    FREE
                                                </span>
                                            </div>

                                            <p className="mt-1.5 text-[11px] leading-5 text-[#66706A]">
                                                Your location is within our
                                                delivery radius.
                                            </p>
                                        </div>

                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#103F35] text-white">
                                            <Check size={16} strokeWidth={3} />
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                                        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8A918D]">
                                            Distance
                                        </span>
                                        <span className="text-[13px] font-extrabold text-[#103F35]">
                                            {distanceKm ?? "—"} km
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={checkDeliveryLocation}
                                    className="flex h-11 w-full items-center justify-center gap-2 border-t border-[#DCEBE2] bg-white text-[10px] font-bold uppercase tracking-[0.08em] text-[#103F35]"
                                >
                                    <MapPin size={14} />
                                    Recheck Location
                                </button>
                            </div>
                        )}

                    {locationChecked &&
                        !checkingDelivery &&
                        orderType === "TAKEAWAY" && (
                            <div className="mt-4 overflow-hidden rounded-[28px] border border-[#E7DDCC] bg-[#FCF7EE] shadow-[0_10px_28px_rgba(123,85,34,0.05)]">
                                <div className="p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#F2E4CA] text-[#A56B1F]">
                                            <ShoppingBag size={23} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-[17px] font-extrabold text-[#795522]">
                                                Takeaway selected
                                            </h3>

                                            <p className="mt-1.5 text-[11px] leading-5 text-[#8A7B65]">
                                                {distanceKm !== null
                                                    ? `You're ${distanceKm} km away from Flutes, outside the 4 km delivery radius.`
                                                    : "Delivery could not be verified, so Takeaway is available."}
                                            </p>
                                        </div>

                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#A56B1F] text-white">
                                            <Check size={16} strokeWidth={3} />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={checkDeliveryLocation}
                                    className="flex h-11 w-full items-center justify-center gap-2 border-t border-[#E9DDC8] bg-white text-[10px] font-bold uppercase tracking-[0.08em] text-[#795522]"
                                >
                                    <MapPin size={14} />
                                    Recheck Location
                                </button>
                            </div>
                        )}

                    {locationError && (
                        <div className="mt-3 rounded-[20px] border border-[#E8D5C8] bg-[#FFF8F2] p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5E6D5] text-[#A56B1F]">
                                    <MapPin size={17} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-[11px] font-extrabold text-[#795522]">
                                        Location update
                                    </p>

                                    <p className="mt-1 text-[10px] leading-5 text-[#8A7B65]">
                                        {locationError}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* CUSTOMER DETAILS */}
                <section className="px-5 pt-7">
                    <SectionTitle
                        number="2"
                        eyebrow="CUSTOMER DETAILS"
                        title="Tell us about you"
                    />

                    <div className="mt-4 space-y-3">

                        <InputField
                            icon={<User size={18} />}
                            label="Full Name"
                            required
                            placeholder="Enter your full name"
                            value={customerName}
                            onChange={setCustomerName}
                        />

                        <InputField
                            icon={<Phone size={18} />}
                            label="Mobile Number"
                            required
                            type="tel"
                            maxLength={10}
                            placeholder="10-digit mobile number"
                            value={customerPhone}
                            onChange={(value) =>
                                setCustomerPhone(
                                    value.replace(/\D/g, "")
                                )
                            }
                        />

                        <InputField
                            icon={<Mail size={18} />}
                            label="Email"
                            optional
                            type="email"
                            placeholder="Email address"
                            value={customerEmail}
                            onChange={setCustomerEmail}
                        />

                    </div>
                </section>

                {/* PICKUP / DELIVERY */}
                <section className="px-5 pt-5">

                    {orderType === "TAKEAWAY" ? (
                        <div className="rounded-[24px] border border-[#D9E4DE] bg-white p-4 shadow-[0_6px_22px_rgba(0,0,0,0.04)]">
                            <div className="flex gap-3">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF3EE] text-[#0F5143]">
                                    <MapPin size={20} />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-extrabold">
                                        Pickup from Flutes
                                    </p>

                                    <p className="mt-1 text-[12px] leading-5 text-[#737A76]">
                                        Flutes Resto, Wakad
                                        <br />
                                        Pickup verification code will be shown after payment.
                                    </p>
                                </div>

                                <ChevronDown
                                    size={17}
                                    className="mt-1 text-[#8C938F]"
                                />

                            </div>
                        </div>
                    ) : (
                        <div className="rounded-[24px] border border-[#D9E4DE] bg-white p-4">

                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3EE] text-[#0F5143]">
                                    <MapPin size={20} />
                                </div>

                                <div>
                                    <p className="text-sm font-extrabold">
                                        Delivery location
                                    </p>

                                    <p className="text-[11px] text-[#737A76]">
                                        Location verified within 4 km
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 space-y-3">

                                <textarea
                                    value={customerAddress}
                                    onChange={(e) =>
                                        setCustomerAddress(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter complete delivery address"
                                    rows={3}
                                    className="w-full resize-none rounded-[16px] border border-[#DDE3DF] bg-[#FAFBFA] px-4 py-3 text-[13px] outline-none transition placeholder:text-[#A0A6A3] focus:border-[#0F5143]"
                                />

                                <div className="grid grid-cols-2 gap-3">

                                    <input
                                        value={landmark}
                                        onChange={(e) =>
                                            setLandmark(e.target.value)
                                        }
                                        placeholder="Landmark"
                                        className="h-12 rounded-[16px] border border-[#DDE3DF] bg-[#FAFBFA] px-4 text-[13px] outline-none placeholder:text-[#A0A6A3] focus:border-[#0F5143]"
                                    />

                                    <input
                                        value={pincode}
                                        onChange={(e) =>
                                            setPincode(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                ).slice(0, 6)
                                            )
                                        }
                                        placeholder="Pincode"
                                        inputMode="numeric"
                                        className="h-12 rounded-[16px] border border-[#DDE3DF] bg-[#FAFBFA] px-4 text-[13px] outline-none placeholder:text-[#A0A6A3] focus:border-[#0F5143]"
                                    />

                                </div>
                            </div>

                        </div>
                    )}

                    {locationError && (
                        <div className="mt-3 rounded-[18px] border border-[#E8D5C8] bg-[#FFF8F2] p-4">
                            <div className="flex gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5E6D5] text-[#A56B1F]">
                                    <MapPin size={17} />
                                </div>

                                <div>
                                    <p className="text-[12px] font-extrabold text-[#795522]">
                                        Delivery location
                                    </p>

                                    <p className="mt-1 text-[11px] leading-5 text-[#8A7B65]">
                                        {locationError}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {deliveryEligible && distanceKm !== null && (
                        <div className="mt-3 rounded-[18px] border border-[#D7E6DD] bg-[#F5FBF7] p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DFF1E7] text-[#0F5143]">
                                        <Check size={17} strokeWidth={3} />
                                    </div>

                                    <div>
                                        <p className="text-[12px] font-extrabold text-[#0F5143]">
                                            Delivery available
                                        </p>

                                        <p className="mt-1 text-[10px] text-[#737A76]">
                                            Your location is within our 4 km delivery radius.
                                        </p>
                                    </div>
                                </div>

                                <span className="text-[12px] font-extrabold text-[#0F5143]">
                                    {distanceKm} km
                                </span>
                            </div>
                        </div>
                    )}

                </section>

                {/* DELIVERY POLICY */}
                <section className="px-5 pt-4">
                    <div className="flex items-center gap-3 rounded-[20px] border border-[#E3E8E4] bg-white px-4 py-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF5F1] text-[#103F35]">
                            <MapPin size={16} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-[#303633]">
                                Delivery within 4 km
                            </p>

                            <p className="mt-0.5 text-[10px] leading-4 text-[#858C88]">
                                Outside the radius, Takeaway is selected automatically.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ORDER SUMMARY */}
                <section className="px-5 pt-7">
                    <SectionTitle
                        number="3"
                        eyebrow="YOUR ORDER"
                        title="Order summary"
                        right={
                            <span className="rounded-full bg-[#EAF3EE] px-3 py-1 text-[10px] font-bold text-[#0F5143]">
                                {cart.length}{" "}
                                {cart.length === 1
                                    ? "ITEM"
                                    : "ITEMS"}
                            </span>
                        }
                    />

                    <div className="mt-4 overflow-hidden rounded-[24px] border border-black/[0.05] bg-white">

                        {cart.map((item, index) => (
                            <div
                                key={item.cartId}
                                className={`flex gap-3 p-4 ${index !== cart.length - 1
                                    ? "border-b border-[#EEF0EE]"
                                    : ""
                                    }`}
                            >

                                <div className="h-[68px] w-[68px] shrink-0 overflow-hidden rounded-[18px] bg-[#ECEDEA]">

                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-[9px] font-bold text-[#8B928E]">
                                            FOOD
                                        </div>
                                    )}

                                </div>

                                <div className="min-w-0 flex-1">

                                    <p className="line-clamp-2 text-[13px] font-extrabold">
                                        {item.name}
                                    </p>

                                    {item.variantName && (
                                        <p className="mt-1 text-[10px] font-medium text-[#7D8580]">
                                            {item.variantName}
                                        </p>
                                    )}

                                    <div className="mt-2 flex items-center gap-2">
                                        <span
                                            className={`h-2 w-2 rounded-full ${item.foodType ===
                                                "NON_VEG"
                                                ? "bg-[#D94645]"
                                                : "bg-[#27965A]"
                                                }`}
                                        />

                                        <span className="text-[10px] text-[#858C88]">
                                            Qty {item.quantity}
                                        </span>
                                    </div>

                                </div>

                                <div className="text-right">
                                    <p className="text-[14px] font-extrabold text-[#0F5143]">
                                        ₹
                                        {Number(item.price) *
                                            item.quantity}
                                    </p>

                                    <p className="mt-1 text-[9px] text-[#929894]">
                                        ₹{item.price} each
                                    </p>
                                </div>

                            </div>
                        ))}

                    </div>
                </section>

                {/* BILL DETAILS */}
                <section className="px-5 pt-5">

                    <div className="rounded-[24px] border border-black/[0.05] bg-white p-5">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B77722]">
                                    BILL DETAILS
                                </p>

                                <h3 className="mt-1 text-[18px] font-extrabold">
                                    Price details
                                </h3>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F3F0]">
                                <ShoppingBag
                                    size={18}
                                    className="text-[#0F5143]"
                                />
                            </div>

                        </div>

                        <div className="mt-5 space-y-3">

                            <BillRow
                                label="Item Total"
                                value={`₹${subtotal.toFixed(2)}`}
                            />

                            <BillRow
                                label="CGST (2.5%)"
                                value={`₹${previewCgst.toFixed(2)}`}
                            />

                            <BillRow
                                label="SGST (2.5%)"
                                value={`₹${previewSgst.toFixed(2)}`}
                            />

                            <BillRow
                                label="Delivery Fee"
                                value={
                                    orderType === "DELIVERY"
                                        ? "FREE"
                                        : "—"
                                }
                                valueClass="text-[#0F5143]"
                            />

                        </div>

                        <div className="my-5 border-t border-dashed border-[#D8DED9]" />

                        <div className="flex items-end justify-between">

                            <div>
                                <p className="text-[10px] font-semibold text-[#858C88]">
                                    TOTAL PAYABLE
                                </p>

                                <p className="mt-1 text-[26px] font-extrabold tracking-[-0.04em] text-[#0F5143]">
                                    ₹{previewTotal.toFixed(2)}
                                </p>
                            </div>

                            <span className="rounded-full bg-[#EAF3EE] px-3 py-1.5 text-[9px] font-bold text-[#0F5143]">
                                {orderType === "TAKEAWAY"
                                    ? "TAKEAWAY"
                                    : orderType === "DELIVERY"
                                        ? "DELIVERY"
                                        : "SELECT LOCATION"}
                            </span>

                        </div>

                    </div>
                </section>

                {/* TAX DETAILS */}
                <section className="px-5 pt-4">

                    <div className="rounded-[20px] bg-[#EFF1EF] p-4">

                        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#7D8580]">
                            TAX INVOICE DETAILS
                        </p>

                        <div className="mt-3 space-y-1 text-[10px] text-[#747C77]">

                            <p>
                                GSTIN:{" "}
                                <span className="font-bold text-[#4F5752]">
                                    {GSTIN}
                                </span>
                            </p>

                            <p>
                                VAT No.:{" "}
                                <span className="font-bold text-[#4F5752]">
                                    {VAT_NO}
                                </span>
                            </p>

                        </div>

                    </div>

                </section>

                {/* SECURITY */}
                <section className="px-5 pt-4">

                    <div className="rounded-[20px] border border-[#DCE5DF] bg-[#F8FBF9] p-4">

                        <div className="flex gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E2F0E9] text-[#0F5143]">
                                <Check
                                    size={17}
                                    strokeWidth={3}
                                />
                            </div>

                            <div>
                                <p className="text-[12px] font-extrabold text-[#0F5143]">
                                    Secure order handover
                                </p>

                                <p className="mt-1 text-[10px] leading-5 text-[#737A76]">
                                    A one-time verification code will be used
                                    for pickup or delivery handover.
                                </p>
                            </div>

                        </div>

                    </div>

                </section>

                {/* ERROR */}
                {errorMessage && (
                    <section className="px-5 pt-4">

                        <div className="rounded-[18px] border border-[#E8C9C9] bg-[#FFF5F5] p-4">
                            <p className="text-[12px] font-bold text-[#B42318]">
                                {errorMessage}
                            </p>
                        </div>

                    </section>
                )}

                {/* STICKY CTA */}
                <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[520px] -translate-x-1/2 border-t border-black/[0.06] bg-[#F7F8F6]/96 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(15,63,53,0.07)] backdrop-blur-xl lg:bottom-6 lg:rounded-b-[32px] lg:border-x lg:border-b lg:shadow-[0_12px_40px_rgba(15,63,53,0.10)]">

                    <button
                        type="button"
                        onClick={handlePlaceOrder}
                        disabled={placingOrder}
                        className="flex min-h-[58px] w-full items-center justify-between rounded-[19px] bg-[#0F5143] px-5 py-3.5 text-white shadow-[0_12px_32px_rgba(15,81,67,0.24)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                    >

                        <div className="text-left">

                            <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-white/60">
                                Total Payable
                            </p>

                            <p className="mt-0.5 text-[18px] font-extrabold">
                                ₹{previewTotal.toFixed(2)}
                            </p>

                        </div>

                        <div className="flex items-center gap-2 text-[13px] font-extrabold">

                            {placingOrder ? (
                                <>
                                    <Loader2
                                        size={17}
                                        className="animate-spin"
                                    />
                                    Creating Order...
                                </>
                            ) : (
                                <>
                                    Create Order
                                    <ArrowRight size={18} />
                                </>
                            )}

                        </div>

                    </button>

                </div>

            </div>
        </main>
    );
}

/* =========================================================
   COMPONENTS
========================================================= */

function SectionTitle({
    number,
    eyebrow,
    title,
    right,
}: {
    number: string;
    eyebrow: string;
    title: string;
    right?: React.ReactNode;
}) {
    return (
        <div className="flex items-end justify-between gap-3">

            <div className="flex items-start gap-3">

                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0F5143] text-[10px] font-extrabold text-white">
                    {number}
                </div>

                <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#B77722]">
                        {eyebrow}
                    </p>

                    <h2 className="mt-0.5 text-[18px] font-extrabold tracking-[-0.02em]">
                        {title}
                    </h2>
                </div>

            </div>

            {right}

        </div>
    );
}

function ProgressStep({
    number,
    label,
    active = false,
}: {
    number: string;
    label: string;
    active?: boolean;
}) {
    return (
        <div className="flex shrink-0 items-center gap-1.5">

            <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-extrabold ${active
                    ? "bg-[#0F5143] text-white"
                    : "bg-[#E7EBE8] text-[#7D8580]"
                    }`}
            >
                {number}
            </div>

            <span
                className={`text-[9px] font-bold ${active
                    ? "text-[#0F5143]"
                    : "text-[#8A918D]"
                    }`}
            >
                {label}
            </span>

        </div>
    );
}

function InputField({
    icon,
    label,
    required,
    optional,
    placeholder,
    value,
    onChange,
    type = "text",
    maxLength,
}: {
    icon: React.ReactNode;
    label: string;
    required?: boolean;
    optional?: boolean;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    maxLength?: number;
}) {
    return (
        <div>

            <div className="mb-1.5 flex items-center gap-1">

                <label className="text-[11px] font-bold text-[#4F5752]">
                    {label}
                </label>

                {required && (
                    <span className="text-[10px] font-bold text-[#B42318]">
                        *
                    </span>
                )}

                {optional && (
                    <span className="text-[9px] font-medium text-[#969D99]">
                        (Optional)
                    </span>
                )}

            </div>

            <div className="flex h-[52px] items-center gap-3 rounded-[17px] border border-[#DDE3DF] bg-white px-4 transition focus-within:border-[#0F5143] focus-within:ring-4 focus-within:ring-[#0F5143]/5">

                <span className="text-[#87908A]">
                    {icon}
                </span>

                <input
                    type={type}
                    value={value}
                    maxLength={maxLength}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                    placeholder={placeholder}
                    className="min-w-0 flex-1 bg-transparent text-[13px] font-medium outline-none placeholder:text-[#A2A8A5]"
                />

            </div>

        </div>
    );
}

function BillRow({
    label,
    value,
    valueClass = "",
}: {
    label: string;
    value: string;
    valueClass?: string;
}) {
    return (
        <div className="flex items-center justify-between text-[13px]">

            <span className="text-[#737A76]">
                {label}
            </span>

            <span
                className={`font-semibold ${valueClass}`}
            >
                {value}
            </span>

        </div>
    );
}

function EmptyCheckout() {
    return (
        <main className="min-h-screen bg-[#EDEFEA]">
            <div className="mx-auto min-h-screen w-full max-w-[480px] bg-[#F7F8F6]">

                <header className="flex h-[72px] items-center gap-4 border-b border-black/[0.05] px-5">

                    <Link
                        href="/cart"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
                    >
                        <ArrowLeft size={19} />
                    </Link>

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B77722]">
                            FLUTES RESTO
                        </p>

                        <h1 className="text-[22px] font-extrabold">
                            Checkout
                        </h1>
                    </div>

                </header>

                <section className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">

                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EAF3EE] text-[#0F5143]">
                        <ShoppingBag size={32} />
                    </div>

                    <h2 className="mt-6 text-[23px] font-extrabold">
                        Your cart is empty
                    </h2>

                    <p className="mt-2 max-w-[300px] text-[13px] leading-6 text-[#737A76]">
                        Add some delicious food from the menu before continuing to checkout.
                    </p>

                    <Link
                        href="/menu"
                        className="mt-7 flex h-12 items-center gap-2 rounded-full bg-[#0F5143] px-7 text-[13px] font-bold text-white shadow-[0_10px_28px_rgba(15,81,67,0.20)]"
                    >
                        Explore Menu
                        <ArrowRight size={17} />
                    </Link>

                </section>

            </div>
        </main>
    );
}

function SuccessScreen({
    order,
}: {
    order: CreatedOrder;
}) {
    return (
        <main className="min-h-screen bg-[#EDEFEA]">
            <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-[#F7F8F6] px-5">

                <div className="flex flex-1 flex-col items-center justify-center text-center">

                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#DFF1E7]">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0F5143] text-white shadow-lg">
                            <Check
                                size={28}
                                strokeWidth={3}
                            />
                        </div>
                    </div>

                    <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.22em] text-[#B77722]">
                        ORDER CREATED
                    </p>

                    <h1 className="mt-2 text-[28px] font-extrabold tracking-[-0.04em]">
                        You're all set!
                    </h1>

                    <p className="mt-2 max-w-[310px] text-[13px] leading-6 text-[#737A76]">
                        Your order has been received. Payment integration will continue from the next step.
                    </p>

                    <div className="mt-7 w-full rounded-[24px] border border-[#DDE5E0] bg-white p-5 text-left">

                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#858C88]">
                            ORDER NUMBER
                        </p>

                        <p className="mt-1 text-[20px] font-extrabold text-[#0F5143]">
                            {order.orderNumber}
                        </p>

                        <div className="my-4 border-t border-dashed border-[#D8DED9]" />

                        <div className="flex items-center justify-between">

                            <span className="text-[12px] text-[#737A76]">
                                Order total
                            </span>

                            <span className="text-[16px] font-extrabold">
                                ₹{Number(order.total).toFixed(2)}
                            </span>

                        </div>

                        <div className="mt-3 flex items-center justify-between">

                            <span className="text-[12px] text-[#737A76]">
                                Order type
                            </span>

                            <span className="rounded-full bg-[#EAF3EE] px-3 py-1 text-[9px] font-bold text-[#0F5143]">
                                {order.orderType}
                            </span>

                        </div>

                    </div>

                    <Link
                        href="/orders"
                        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0F5143] text-[13px] font-bold text-white shadow-[0_10px_28px_rgba(15,81,67,0.20)]"
                    >
                        View My Orders
                        <ArrowRight size={17} />
                    </Link>

                    <Link
                        href="/menu"
                        className="mt-3 text-[12px] font-bold text-[#0F5143]"
                    >
                        Continue browsing menu
                    </Link>

                </div>

            </div>
        </main>
    );
}