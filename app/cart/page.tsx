"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  addToCart,
  type CartItem,
} from "@/lib/cart";

type Suggestion = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  foodType: "VEG" | "NON_VEG";
  variants: {
    id: string;
    name: string;
    price: number;
    isAvailable: boolean;
  }[];
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);

  /* =========================================================
     LOAD CART
  ========================================================= */

  useEffect(() => {
    const loadCart = () => {
      setCart(getCart());
    };

    loadCart();

    window.addEventListener("cart-updated", loadCart);

    return () => {
      window.removeEventListener("cart-updated", loadCart);
    };
  }, []);

  /* =========================================================
     LOAD SUGGESTIONS
  ========================================================= */

  useEffect(() => {
    const loadSuggestions = async () => {
      if (cart.length === 0) {
        setSuggestions([]);
        setLoadingSuggestions(false);
        return;
      }

      setLoadingSuggestions(true);

      try {
        const ids = cart.map((item) => item.menuItemId);

        const response = await fetch(
          `/api/menu/suggestions?ids=${encodeURIComponent(
            ids.join(",")
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to load suggestions");
        }

        const data = await response.json();

        if (data.success) {
          setSuggestions(data.items ?? []);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("CART SUGGESTIONS ERROR:", error);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    loadSuggestions();
  }, [cart]);

  /* =========================================================
     TOTALS
  ========================================================= */

  const subtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );
  }, [cart]);

  const itemCount = useMemo(() => {
    return cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [cart]);

  /* =========================================================
     QUANTITY
  ========================================================= */

  const changeQuantity = (
    cartId: string,
    quantity: number
  ) => {
    const updated = updateCartQuantity(
      cartId,
      quantity
    );

    setCart(updated);
  };

  /* =========================================================
     REMOVE
  ========================================================= */

  const removeItem = (cartId: string) => {
    const updated = removeFromCart(cartId);

    setCart(updated);
  };

  /* =========================================================
     EMPTY CART
  ========================================================= */

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#F7F8F6] text-[#171A19]">
        <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-[#F7F8F6]">

          <header className="flex items-center gap-3 px-5 pb-4 pt-6">
            <Link
              href="/menu"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm active:scale-95"
            >
              <ArrowLeft size={20} />
            </Link>

            <h1 className="text-[25px] font-extrabold">
              Your Cart
            </h1>
          </header>

          <div className="flex flex-1 flex-col items-center justify-center px-8 pb-24 text-center">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#EEF6F2]">
              <ShoppingBag
                size={42}
                className="text-[#0F5143]"
              />
            </div>

            <h2 className="mt-6 text-[22px] font-extrabold">
              Your cart is empty
            </h2>

            <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-[#7A817D]">
              Looks like you haven't added anything
              delicious yet.
            </p>

            <Link
              href="/menu"
              className="mt-7 flex items-center gap-2 rounded-full bg-[#0F5143] px-6 py-3.5 text-sm font-bold text-white shadow-lg active:scale-95"
            >
              Explore Menu
              <ArrowRight size={17} />
            </Link>

          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     CART
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#F7F8F6] text-[#171A19]">
      <div className="mx-auto min-h-screen w-full max-w-[480px] bg-[#F7F8F6] pb-32">

        {/* HEADER */}

        <header className="flex items-center justify-between px-5 pb-4 pt-6">

          <div className="flex items-center gap-3">

            <Link
              href="/menu"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm active:scale-95"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <p className="text-xs text-[#7A817D]">
                {itemCount} items
              </p>

              <h1 className="text-[25px] font-extrabold">
                Your Cart
              </h1>
            </div>

          </div>

          <span className="rounded-full bg-[#EEF6F2] px-3 py-1.5 text-xs font-bold text-[#0F5143]">
            {itemCount}
          </span>

        </header>

        {/* CART ITEMS */}

        <section className="px-5">

          <div className="space-y-3">

            {cart.map((item) => (
              <article
                key={item.cartId}
                className="rounded-[22px] bg-white p-3 shadow-[0_5px_20px_rgba(0,0,0,0.05)]"
              >

                <div className="flex gap-3">

                  {/* IMAGE */}

                  <div className="h-[88px] w-[88px] shrink-0 overflow-hidden rounded-[17px] bg-[#EDEBE6]">

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-3xl">
                        {item.foodType === "VEG"
                          ? "🥗"
                          : "🍗"}
                      </div>
                    )}

                  </div>

                  {/* DETAILS */}

                  <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-2">

                      <div className="min-w-0">

                        <div className="flex items-start gap-2">

                          <span
                            className={`mt-1 flex h-3 w-3 shrink-0 items-center justify-center rounded-[2px] border-2 ${item.foodType === "VEG"
                                ? "border-green-600"
                                : "border-red-600"
                              }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${item.foodType === "VEG"
                                  ? "bg-green-600"
                                  : "bg-red-600"
                                }`}
                            />
                          </span>

                          <h3 className="line-clamp-2 text-[14px] font-bold leading-tight">
                            {item.name}
                          </h3>

                        </div>

                        {item.variantName && (
                          <p className="mt-1 text-[11px] text-[#7A817D]">
                            {item.variantName}
                          </p>
                        )}

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeItem(item.cartId)
                        }
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF1EE] text-[#C45735] active:scale-95"
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>

                    <div className="mt-3 flex items-center justify-between">

                      <span className="text-[16px] font-extrabold">
                        ₹{item.price * item.quantity}
                      </span>

                      <div className="flex items-center gap-1 rounded-full bg-[#F1F3F0] p-1">

                        <button
                          type="button"
                          onClick={() =>
                            changeQuantity(
                              item.cartId,
                              item.quantity - 1
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm active:scale-90"
                        >
                          <Minus size={13} />
                        </button>

                        <span className="w-7 text-center text-xs font-extrabold">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            changeQuantity(
                              item.cartId,
                              item.quantity + 1
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F5143] text-white shadow-sm active:scale-90"
                        >
                          <Plus size={13} />
                        </button>

                      </div>

                    </div>

                  </div>
                </div>
              </article>
            ))}

          </div>
        </section>

        {/* =================================================
            SUGGESTIONS
        ================================================= */}

        {!loadingSuggestions &&
          suggestions.length > 0 && (
            <section className="mt-8">

              <div className="mb-4 px-5">

                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#B56A16]">
                  Complete your meal
                </p>

                <h2 className="mt-1 text-[20px] font-extrabold">
                  You might also like
                </h2>

              </div>

              <div className="flex gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

                {suggestions.map((item) => (
                  <SuggestionCard
                    key={item.id}
                    item={item}
                    onAdded={() => setCart(getCart())}
                  />
                ))}

              </div>

            </section>
          )}

        {/* BILL */}

        <section className="mt-7 px-5">

          <div className="rounded-[24px] bg-white p-5 shadow-[0_5px_20px_rgba(0,0,0,0.05)]">

            <h2 className="text-[18px] font-extrabold">
              Bill Details
            </h2>

            <div className="mt-4 space-y-3 text-sm">

              <div className="flex justify-between">
                <span className="text-[#7A817D]">
                  Item total
                </span>

                <span className="font-semibold">
                  ₹{subtotal}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#7A817D]">
                  Delivery fee
                </span>

                <span className="font-semibold text-[#0F5143]">
                  FREE
                </span>
              </div>

              <div className="my-3 border-t border-dashed border-[#DADFD9]" />

              <div className="flex items-center justify-between">

                <span className="text-[16px] font-extrabold">
                  To Pay
                </span>

                <span className="text-[21px] font-extrabold text-[#0F5143]">
                  ₹{subtotal}
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* CHECKOUT */}

        <div className="mt-5 px-5">

          <Link
            href="/checkout"
            className="flex w-full items-center justify-between rounded-full bg-[#0F5143] px-6 py-4 text-white shadow-[0_8px_25px_rgba(15,81,67,0.2)] active:scale-[0.98]"
          >

            <div>
              <p className="text-[11px] text-white/65">
                Total
              </p>

              <p className="text-[17px] font-extrabold">
                ₹{subtotal}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-bold">
              Proceed to Checkout
              <ArrowRight size={18} />
            </div>

          </Link>

        </div>

      </div>
    </main>
  );
}

/* =========================================================
   SUGGESTION CARD
========================================================= */

function SuggestionCard({
  item,
  onAdded,
}: {
  item: Suggestion;
  onAdded: () => void;
}) {
  const [adding, setAdding] = useState(false);

  const addSuggestion = () => {
    // Variants need selection first.

    setAdding(true);

    addToCart({
      cartId: item.id,
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      foodType: item.foodType,
    });

    onAdded();

    setTimeout(() => {
      setAdding(false);
    }, 400);
  };

  return (
    <article className="min-w-[175px] overflow-hidden rounded-[20px] bg-white shadow-[0_5px_20px_rgba(0,0,0,0.05)]">

      <div className="relative h-[115px] bg-[#EDEBE6]">

        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">
            {item.foodType === "VEG"
              ? "🥗"
              : "🍗"}
          </div>
        )}

      </div>

      <div className="p-3">

        <h3 className="line-clamp-2 min-h-[36px] text-[13px] font-bold leading-tight">
          {item.name}
        </h3>

        <div className="mt-3 flex items-center justify-between">

          <span className="text-[15px] font-extrabold">
            ₹{item.price}
          </span>

          <button
            type="button"
            onClick={addSuggestion}
            disabled={adding}
            className="rounded-full bg-[#0F5143] px-3 py-2 text-[10px] font-extrabold text-white active:scale-95 disabled:opacity-60"
          >
            {adding ? "ADDED" : "ADD"}
          </button>

        </div>

      </div>

    </article>
  );
}