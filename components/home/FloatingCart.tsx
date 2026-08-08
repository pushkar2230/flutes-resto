"use client";

import { ShoppingCart, ArrowRight } from "lucide-react";

export default function FloatingCart() {
  return (
    <div className="fixed bottom-[72px] left-1/2 z-50 w-[calc(100%-32px)] max-w-[448px] -translate-x-1/2">
      <div className="flex items-center justify-between rounded-full bg-[#073F35] p-2 pl-4 text-white shadow-[0_12px_35px_rgba(0,0,0,0.25)]">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/30">
            <ShoppingCart size={21} />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E58A18] text-[10px] font-bold">
              2
            </span>
          </div>

          <div>
            <p className="text-sm font-semibold">2 Items</p>
            <p className="text-xs text-white/70">₹878</p>
          </div>
        </div>

        <button className="flex items-center gap-2 rounded-full bg-[#E58A18] px-5 py-3 text-sm font-bold">
          View Cart
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}