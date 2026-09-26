"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  ChevronRight,
} from "lucide-react";

import { getCart } from "@/lib/cart";

export default function FloatingCart() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();

      const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
      );

      setCartCount(count);
    };

    updateCartCount();

    window.addEventListener(
      "cart-updated",
      updateCartCount
    );

    window.addEventListener(
      "storage",
      updateCartCount
    );

    return () => {
      window.removeEventListener(
        "cart-updated",
        updateCartCount
      );

      window.removeEventListener(
        "storage",
        updateCartCount
      );
    };
  }, []);

  if (cartCount <= 0) {
    return null;
  }

  return (
    <Link
      href="/cart"
      aria-label="View cart"
      className="
        fixed
        bottom-5
        left-1/2
        z-[90]
        flex
        h-[58px]
        w-[calc(100%-32px)]
        max-w-[448px]
        -translate-x-1/2
        items-center
        justify-between
        rounded-full
        bg-[#103F35]
        pl-5
        pr-2
        text-white
        shadow-[0_14px_40px_rgba(16,63,53,0.28)]
        ring-1
        ring-white/10
        transition-all
        duration-200
        active:scale-[0.98]
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
          <ShoppingCart
            size={19}
            strokeWidth={2}
            color="white"
          />
        </div>

        <div className="text-left">
          <p className="text-[13px] font-semibold leading-none text-white">
            View Cart
          </p>

          <p className="mt-1 text-[10px] text-white/60">
            {cartCount}{" "}
            {cartCount === 1
              ? "item"
              : "items"}
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex h-10 items-center gap-1 rounded-full bg-white px-4 text-[12px] font-bold text-[#103F35]">
        View Cart
        <ChevronRight size={15} />
      </div>
    </Link>
  );
}