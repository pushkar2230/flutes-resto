"use client";

import { useState } from "react";

export default function FoodTypeToggle() {
  const [type, setType] = useState<"VEG" | "NON_VEG">("VEG");

  return (
    <section className="px-5 pt-5">
      <div className="mx-auto flex max-w-[290px] rounded-full bg-white p-1.5 shadow-sm">
        <button
          onClick={() => setType("VEG")}
          className={`flex-1 rounded-full py-3 text-sm font-semibold transition-all ${
            type === "VEG"
              ? "bg-[#0F5143] text-white shadow-md"
              : "text-[#4A504D]"
          }`}
        >
          🌿 Veg
        </button>

        <button
          onClick={() => setType("NON_VEG")}
          className={`flex-1 rounded-full py-3 text-sm font-semibold transition-all ${
            type === "NON_VEG"
              ? "bg-[#0F5143] text-white shadow-md"
              : "text-[#4A504D]"
          }`}
        >
          🍗 Non-Veg
        </button>
      </div>
    </section>
  );
}