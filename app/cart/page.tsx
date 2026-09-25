"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
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

function formatPrice(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function formatName(name: string) {
  return name
    .replace(/([a-zA-Z])(\d+)/g, "$1 $2")
    .replace(/(\d+)([a-zA-Z])/g, "$1 $2")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);

  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);

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
     LOAD ADMIN CONTROLLED SUGGESTIONS
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
          `/api/menu/suggestions?ids=${encodeURIComponent(ids.join(","))}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load suggestions");
        }

        const data = await response.json();

        if (data.success) {
          const cartIds = new Set(cart.map((item) => item.menuItemId));

          const uniqueSuggestions = (data.items ?? []).filter(
            (item: Suggestion, index: number, array: Suggestion[]) =>
              !cartIds.has(item.id) &&
              array.findIndex((entry) => entry.id === item.id) === index
          );

          setSuggestions(uniqueSuggestions);
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
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [cart]);

  const itemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  /* =========================================================
     QUANTITY
  ========================================================= */

  const changeQuantity = (cartId: string, quantity: number) => {
    if (quantity < 1) return;

    const updated = updateCartQuantity(cartId, quantity);
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
      <main className="min-h-screen bg-[#EDEFEA] text-[#171A19]">
        <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-[#F7F8F6]">
          {/* HEADER */}
          <header className="flex items-center gap-3 px-5 pb-5 pt-6">
            <Link
              href="/menu"
              aria-label="Back to menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E1E5E1] bg-white text-[#103F35] shadow-[0_5px_18px_rgba(16,63,53,0.06)] transition-transform active:scale-95"
            >
              <ArrowLeft size={19} strokeWidth={2} />
            </Link>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#B58A42]">
                Flutes Resto
              </p>

              <h1 className="mt-0.5 text-[24px] font-semibold tracking-[-0.035em]">
                Your Cart
              </h1>
            </div>
          </header>

          {/* EMPTY STATE */}
          <div className="flex flex-1 flex-col items-center justify-center px-8 pb-28 text-center">
            <div className="relative flex h-[112px] w-[112px] items-center justify-center rounded-[34px] border border-[#DDE5DF] bg-white shadow-[0_18px_45px_rgba(16,63,53,0.09)]">
              <div className="absolute inset-3 rounded-[27px] bg-[#EEF5F1]" />

              <ShoppingBag
                size={42}
                strokeWidth={1.45}
                className="relative text-[#103F35]"
              />

              <span className="absolute bottom-4 right-4 h-2.5 w-2.5 rounded-full bg-[#D6A34A]" />
            </div>

            <p className="mt-8 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#B58A42]">
              Nothing here yet
            </p>

            <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.035em]">
              Your cart is empty
            </h2>

            <p className="mt-2 max-w-[285px] text-[13px] leading-6 text-[#7A817D]">
              Discover something delicious from our menu and make your order.
            </p>

            <Link
              href="/menu"
              className="mt-8 flex h-12 items-center gap-2 rounded-full bg-[#103F35] px-6 text-[13px] font-semibold text-white shadow-[0_10px_25px_rgba(16,63,53,0.18)] transition-transform active:scale-[0.97]"
            >
              Explore Menu
              <ArrowRight size={16} strokeWidth={2} />
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
    <main className="min-h-screen bg-[#EDEFEA] text-[#171A19]">
      <div className="mx-auto min-h-screen w-full max-w-[480px] overflow-hidden bg-[#F7F8F6] pb-32">
        {/* HEADER */}
        <header className="flex items-center justify-between px-5 pb-5 pt-6">
          <div className="flex items-center gap-3">
            <Link
              href="/menu"
              aria-label="Back to menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E1E5E1] bg-white text-[#103F35] shadow-[0_5px_18px_rgba(16,63,53,0.06)] transition-transform active:scale-95"
            >
              <ArrowLeft size={19} strokeWidth={2} />
            </Link>

            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#B58A42]">
                Order Summary
              </p>

              <h1 className="mt-0.5 text-[24px] font-semibold tracking-[-0.035em]">
                Your Cart
              </h1>
            </div>
          </div>

          <div className="flex h-10 min-w-10 items-center justify-center rounded-full border border-[#DDE5DF] bg-white px-3 text-[12px] font-bold text-[#103F35] shadow-[0_4px_15px_rgba(16,63,53,0.05)]">
            {itemCount}
          </div>
        </header>

        {/* CART ITEMS */}
        <section className="px-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9A9F9B]">
                Selected dishes
              </p>

              <h2 className="mt-1 text-[16px] font-semibold">
                Items in your cart
              </h2>
            </div>

            <span className="text-[11px] font-medium text-[#7A817D]">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="space-y-3">
            {cart.map((item) => (
              <article
                key={item.cartId}
                className="overflow-hidden rounded-[25px] border border-[#E3E7E3] bg-white p-3 shadow-[0_8px_26px_rgba(23,26,25,0.055)]"
              >
                <div className="flex gap-3.5">
                  {/* IMAGE */}
                  <div className="relative h-[94px] w-[94px] shrink-0 overflow-hidden rounded-[20px] bg-[#EDEBE6]">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag
                          size={27}
                          strokeWidth={1.4}
                          className="text-[#A5ADA8]"
                        />
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2 py-1 backdrop-blur-sm">
                      <FoodTypeIndicator foodType={item.foodType} compact />
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="line-clamp-2 text-[14px] font-semibold leading-[1.25] tracking-[-0.01em]">
                          {formatName(item.name)}
                        </h3>

                        {item.variantName && (
                          <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#F2F4F1] px-2 py-1">
                            <span className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#737A75]">
                              {formatName(item.variantName)}
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.cartId)}
                        aria-label={`Remove ${item.name}`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#F0DEDA] bg-[#FFF7F5] text-[#B85C49] transition-transform active:scale-90"
                      >
                        <Trash2 size={14} strokeWidth={1.8} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#A0A6A2]">
                          Item total
                        </p>

                        <p className="mt-0.5 text-[17px] font-bold tracking-[-0.02em] text-[#103F35]">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>

                      <QuantityControl
                        quantity={item.quantity}
                        onDecrease={() =>
                          changeQuantity(item.cartId, item.quantity - 1)
                        }
                        onIncrease={() =>
                          changeQuantity(item.cartId, item.quantity + 1)
                        }
                      />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SUGGESTIONS */}
        {!loadingSuggestions && suggestions.length > 0 && (
          <section className="mt-9">
            <div className="mb-4 flex items-end justify-between px-5">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#B58A42]">
                  Curated for you
                </p>

                <h2 className="mt-1 text-[21px] font-semibold tracking-[-0.035em]">
                  Complete your meal
                </h2>
              </div>

              <span className="pb-0.5 text-[10px] font-medium text-[#8A918D]">
                Chef picks
              </span>
            </div>

            <div className="flex gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {suggestions.map((item) => (
                <SuggestionCard
                  key={item.id}
                  item={item}
                  onSelect={() => {
                    if (item.variants?.length > 0) {
                      setSelectedSuggestion(item);
                    } else {
                      addSuggestionDirectly(item);
                    }
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* BILL */}
        <section className="mt-8 px-5">
          <div className="overflow-hidden rounded-[27px] border border-[#E0E5E1] bg-white shadow-[0_8px_28px_rgba(23,26,25,0.055)]">
            <div className="flex items-center justify-between border-b border-[#EEF0ED] px-5 py-4">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#B58A42]">
                  Summary
                </p>

                <h2 className="mt-1 text-[18px] font-semibold">
                  Bill Details
                </h2>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF5F1] text-[#103F35]">
                <ShoppingBag size={16} strokeWidth={1.8} />
              </div>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#7A817D]">
                  Item total
                </span>

                <span className="text-[13px] font-semibold">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#7A817D]">
                  Delivery fee
                </span>

                <span className="rounded-full bg-[#EEF5F1] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.05em] text-[#247A43]">
                  Free
                </span>
              </div>

              <div className="border-t border-dashed border-[#DCE1DD]" />

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#9A9F9B]">
                    Total payable
                  </p>

                  <p className="mt-1 text-[22px] font-bold tracking-[-0.035em] text-[#103F35]">
                    {formatPrice(subtotal)}
                  </p>
                </div>

                <span className="mb-1 text-[10px] font-medium text-[#8A918D]">
                  Taxes included
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CHECKOUT */}
        <div className="mt-5 px-5">
          <Link
            href="/checkout"
            className="group flex min-h-[68px] w-full items-center justify-between rounded-[22px] bg-[#103F35] px-5 text-white shadow-[0_12px_30px_rgba(16,63,53,0.22)] transition-transform active:scale-[0.985]"
          >
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-white/55">
                Total
              </p>

              <p className="mt-0.5 text-[19px] font-bold tracking-[-0.02em]">
                {formatPrice(subtotal)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[12px] font-semibold">
                Proceed to Checkout
              </span>

              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D6A34A] text-[#103F35] transition-transform group-active:translate-x-0.5">
                <ArrowRight size={16} strokeWidth={2.2} />
              </span>
            </div>
          </Link>

          <p className="mt-3 text-center text-[9px] font-medium tracking-[0.03em] text-[#9A9F9B]">
            Secure checkout • Freshly prepared • Flutes Resto
          </p>
        </div>
      </div>

      {/* VARIANT SELECTOR */}
      {selectedSuggestion && (
        <VariantSelector
          item={selectedSuggestion}
          onClose={() => setSelectedSuggestion(null)}
          onAdded={() => {
            setSelectedSuggestion(null);
            setCart(getCart());
          }}
        />
      )}
    </main>
  );

  function addSuggestionDirectly(item: Suggestion) {
    addToCart({
      cartId: item.id,
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      foodType: item.foodType,
    });

    setCart(getCart());
  }
}

/* =========================================================
   FOOD TYPE INDICATOR
========================================================= */

function FoodTypeIndicator({
  foodType,
  compact = false,
}: {
  foodType: "VEG" | "NON_VEG";
  compact?: boolean;
}) {
  const isVeg = foodType === "VEG";

  return (
    <div className="flex items-center gap-1">
      <span
        className={`flex items-center justify-center rounded-[2px] border ${compact ? "h-3 w-3" : "h-3.5 w-3.5"
          } ${isVeg ? "border-[#4E9A62]" : "border-[#C95C5C]"
          }`}
      >
        <span
          className={`rounded-full ${compact ? "h-1.5 w-1.5" : "h-1.5 w-1.5"
            } ${isVeg ? "bg-[#4E9A62]" : "bg-[#C95C5C]"}`}
        />
      </span>

      {!compact && (
        <span className="text-[9px] font-medium text-[#747B76]">
          {isVeg ? "VEG" : "NON-VEG"}
        </span>
      )}
    </div>
  );
}

/* =========================================================
   QUANTITY CONTROL
========================================================= */

function QuantityControl({
  quantity,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="flex h-9 items-center rounded-full border border-[#DDE3DE] bg-[#F5F7F4] p-1">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
        className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#103F35] shadow-[0_2px_7px_rgba(16,63,53,0.08)] transition-transform active:scale-90 disabled:cursor-not-allowed disabled:opacity-35"
      >
        <Minus size={12} strokeWidth={2.2} />
      </button>

      <span className="w-8 text-center text-[11px] font-bold text-[#252A28]">
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        aria-label="Increase quantity"
        className="flex h-7 w-7 items-center justify-center rounded-full bg-[#103F35] text-white shadow-[0_3px_9px_rgba(16,63,53,0.18)] transition-transform active:scale-90"
      >
        <Plus size={12} strokeWidth={2.2} />
      </button>
    </div>
  );
}

/* =========================================================
   SUGGESTION CARD
========================================================= */

function SuggestionCard({
  item,
  onSelect,
}: {
  item: Suggestion;
  onSelect: () => void;
}) {
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    setAdding(true);
    onSelect();

    if (item.variants?.length === 0) {
      window.setTimeout(() => setAdding(false), 400);
    }
  };

  return (
    <article className="min-w-[178px] max-w-[178px] overflow-hidden rounded-[24px] border border-[#E1E5E1] bg-white shadow-[0_7px_24px_rgba(23,26,25,0.055)]">
      {/* IMAGE */}
      <div className="relative h-[122px] overflow-hidden bg-[#EDEBE6]">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ShoppingBag
              size={28}
              strokeWidth={1.35}
              className="text-[#A5ADA8]"
            />
          </div>
        )}

        <div className="absolute left-2.5 top-2.5 rounded-full bg-white/90 px-2 py-1 shadow-sm backdrop-blur-sm">
          <FoodTypeIndicator foodType={item.foodType} />
        </div>

        {item.variants?.length > 0 && (
          <div className="absolute bottom-2.5 right-2.5 rounded-full bg-[#103F35]/90 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-white">
            Options
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-3.5">
        <h3 className="line-clamp-2 min-h-[38px] text-[13px] font-semibold leading-[1.35] tracking-[-0.01em]">
          {formatName(item.name)}
        </h3>

        <div className="mt-3.5 flex items-center justify-between gap-2">
          <div>
            <p className="text-[9px] uppercase tracking-[0.08em] text-[#9A9F9B]">
              From
            </p>

            <p className="mt-0.5 text-[15px] font-bold text-[#103F35]">
              {formatPrice(item.price)}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={adding}
            className="flex h-9 items-center gap-1.5 rounded-full bg-[#103F35] px-3.5 text-[9px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_4px_12px_rgba(16,63,53,0.15)] transition-transform active:scale-95 disabled:opacity-60"
          >
            {adding ? (
              <>
                <Check size={12} strokeWidth={2.5} />
                Added
              </>
            ) : item.variants?.length > 0 ? (
              <>
                Add
                <ChevronDown size={12} />
              </>
            ) : (
              "Add"
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   VARIANT SELECTOR
========================================================= */

function VariantSelector({
  item,
  onClose,
  onAdded,
}: {
  item: Suggestion;
  onClose: () => void;
  onAdded: () => void;
}) {
  const availableVariants = item.variants.filter(
    (variant) => variant.isAvailable
  );

  const [selectedVariantId, setSelectedVariantId] = useState(
    availableVariants[0]?.id ?? ""
  );

  const selectedVariant = availableVariants.find(
    (variant) => variant.id === selectedVariantId
  );

  const handleAdd = () => {
    if (!selectedVariant) return;

    addToCart({
      cartId: `${item.id}-${selectedVariant.id}`,
      menuItemId: item.id,
      name: item.name,
      variantName: selectedVariant.name,
      price: selectedVariant.price,
      quantity: 1,
      image: item.image,
      foodType: item.foodType,
    });

    onAdded();
  };

  if (availableVariants.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100]">
      {/* BACKDROP */}
      <button
        type="button"
        aria-label="Close variant selector"
        onClick={onClose}
        className="absolute inset-0 bg-[#071F1A]/45 backdrop-blur-[2px]"
      />

      {/* SHEET */}
      <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[480px] rounded-t-[30px] border-t border-white/20 bg-[#F7F8F6] px-5 pb-7 pt-3 shadow-[0_-15px_50px_rgba(0,0,0,0.18)]">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-[#D4D9D5]" />

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#B58A42]">
              Choose an option
            </p>

            <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.03em]">
              {formatName(item.name)}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#DDE3DE] bg-white text-[#5F6863] transition-transform active:scale-90"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 space-y-2.5">
          {availableVariants.map((variant) => {
            const selected = selectedVariantId === variant.id;

            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariantId(variant.id)}
                className={`flex w-full items-center justify-between rounded-[18px] border px-4 py-3.5 text-left transition-all ${selected
                  ? "border-[#103F35] bg-[#EEF5F1] shadow-[0_4px_15px_rgba(16,63,53,0.07)]"
                  : "border-[#E0E4E0] bg-white"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${selected
                      ? "border-[#103F35] bg-[#103F35]"
                      : "border-[#C9CFCA] bg-white"
                      }`}
                  >
                    {selected && (
                      <Check
                        size={11}
                        strokeWidth={3}
                        className="text-white"
                      />
                    )}
                  </span>

                  <span
                    className={`text-[13px] font-semibold ${selected ? "text-[#103F35]" : "text-[#343A37]"
                      }`}
                  >
                    {formatName(variant.name)}
                  </span>
                </div>

                <span
                  className={`text-[13px] font-bold ${selected ? "text-[#103F35]" : "text-[#68716C]"
                    }`}
                >
                  {formatPrice(variant.price)}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!selectedVariant}
          className="mt-5 flex h-[56px] w-full items-center justify-between rounded-[19px] bg-[#103F35] px-5 text-white shadow-[0_10px_25px_rgba(16,63,53,0.20)] transition-transform active:scale-[0.985] disabled:opacity-50"
        >
          <div>
            <p className="text-[9px] uppercase tracking-[0.15em] text-white/55">
              Selected
            </p>

            <p className="mt-0.5 text-[14px] font-semibold">
              {selectedVariant
                ? formatName(selectedVariant.name)
                : "Choose an option"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold">
              {selectedVariant
                ? formatPrice(selectedVariant.price)
                : formatPrice(item.price)}
            </span>

            <ArrowRight size={17} />
          </div>
        </button>
      </div>
    </div>
  );
}