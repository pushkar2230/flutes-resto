"use client";

import { Flame, Leaf, Utensils } from "lucide-react";
import { useState } from "react";

type FoodType = "ALL" | "VEG" | "NON_VEG";

type FoodTypeToggleProps = {
  foodType: FoodType;
  onFoodTypeChange: (type: FoodType) => void;
};

export default function FoodTypeToggle({ foodType, onFoodTypeChange }: FoodTypeToggleProps) {
  return (
    <section className="px-5 pt-6">
      <div className="mx-auto flex max-w-[330px] rounded-[18px] border border-[#DDE2DE] bg-white p-1.5 shadow-[0_6px_20px_rgba(16,63,53,0.07)]">

        {/* ALL */}
        <button
          type="button"
          onClick={() => onFoodTypeChange("ALL")}
          className={`flex h-[44px] flex-1 items-center justify-center gap-1.5 rounded-[13px] text-[12px] font-semibold transition-all ${foodType === "ALL"
            ? "bg-[#103F35] text-white shadow-[0_4px_12px_rgba(16,63,53,0.20)]"
            : "text-[#737A75]"
            }`}
        >
          <Utensils size={14} strokeWidth={1.8} />
          <span>All</span>
        </button>

        {/* VEG */}
        <button
          type="button"
          onClick={() => onFoodTypeChange("VEG")}
          className={`flex h-[44px] flex-1 items-center justify-center gap-1.5 rounded-[13px] text-[12px] font-semibold transition-all ${foodType === "VEG"
            ? "bg-[#EAF5ED] text-[#247A43] shadow-[0_3px_10px_rgba(36,122,67,0.12)]"
            : "text-[#737A75]"
            }`}
        >
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full ${foodType === "VEG"
              ? "bg-[#247A43] text-white"
              : "bg-[#EEF2EE] text-[#4D8065]"
              }`}
          >
            <Leaf size={11} strokeWidth={2.2} />
          </span>

          <span>Veg</span>
        </button>

        {/* NON-VEG */}
        <button
          type="button"
          onClick={() => onFoodTypeChange("NON_VEG")}
          className={`flex h-[44px] flex-1 items-center justify-center gap-1.5 rounded-[13px] text-[12px] font-semibold transition-all ${foodType === "NON_VEG"
            ? "bg-[#FBECEC] text-[#B3262E] shadow-[0_3px_10px_rgba(179,38,46,0.12)]"
            : "text-[#737A75]"
            }`}
        >
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full ${foodType === "NON_VEG"
              ? "bg-[#B3262E] text-white"
              : "bg-[#F3EEEE] text-[#A45A60]"
              }`}
          >
            <Flame size={11} strokeWidth={2.2} />
          </span>

          <span>Non-Veg</span>
        </button>
      </div>
    </section>
  );
}