"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  RotateCcw,
  LayoutGrid,
  ShoppingCart,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getCartCount } from "@/lib/cart";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Order Again",
    href: "/orders",
    icon: RotateCcw,
  },
  {
    label: "Categories",
    href: "/menu",
    icon: LayoutGrid,
  },
  {
    label: "Cart",
    href: "/cart",
    icon: ShoppingCart,
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCart = () => {
      setCartCount(getCartCount());
    };

    updateCart();

    window.addEventListener(
      "cart-updated",
      updateCart
    );

    return () => {
      window.removeEventListener(
        "cart-updated",
        updateCart
      );
    };
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-[480px] border-t border-black/[0.06] bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-6px_25px_rgba(0,0,0,0.08)] backdrop-blur-xl">
      <div className="grid grid-cols-4">

        {navItems.map((item) => {
          const Icon = item.icon;

          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(
                item.href
              );

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex min-h-[62px] flex-col items-center justify-center gap-1"
            >
              {/* Active indicator */}
              {active && (
                <span className="absolute top-0 h-[3px] w-8 rounded-full bg-[#0F5143]" />
              )}

              <div
                className={`relative flex h-9 w-11 items-center justify-center rounded-full transition-all ${active
                    ? "bg-[#EEF6F2]"
                    : "bg-transparent"
                  }`}
              >
                <Icon
                  size={21}
                  strokeWidth={
                    active ? 2.5 : 2
                  }
                  className={
                    active
                      ? "text-[#0F5143]"
                      : "text-[#737A76]"
                  }
                />

                {/* Cart count */}
                {item.label === "Cart" &&
                  cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#E58A18] px-1 text-[9px] font-extrabold text-white">
                      {cartCount > 99
                        ? "99+"
                        : cartCount}
                    </span>
                  )}
              </div>

              <span
                className={`text-[10px] leading-none ${active
                    ? "font-bold text-[#0F5143]"
                    : "font-medium text-[#737A76]"
                  }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

      </div>
    </nav>
  );
}