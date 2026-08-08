"use client";

import {
  Home,
  UtensilsCrossed,
  ShoppingCart,
  ClipboardList,
  UserRound,
} from "lucide-react";

const items = [
  { label: "Home", icon: Home },
  { label: "Menu", icon: UtensilsCrossed },
  { label: "Cart", icon: ShoppingCart },
  { label: "Orders", icon: ClipboardList },
  { label: "Profile", icon: UserRound },
];

export default function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/5 bg-white/95 px-4 pb-2 pt-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[480px] items-center justify-between">
        {items.map((item, index) => {
          const Icon = item.icon;
          const active = index === 0;

          return (
            <button
              key={item.label}
              className={`relative flex min-w-[52px] flex-col items-center gap-1 text-[10px] font-medium ${
                active ? "text-[#0F5143]" : "text-[#7A7E7B]"
              }`}
            >
              <Icon size={21} strokeWidth={active ? 2.5 : 1.8} />

              <span>{item.label}</span>

              {active && (
                <span className="absolute -bottom-2 h-1 w-5 rounded-full bg-[#E58A18]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}