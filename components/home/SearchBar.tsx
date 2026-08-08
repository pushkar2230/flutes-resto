"use client";

import { Search, SlidersHorizontal } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="px-5 pt-4">
      <div className="flex h-[58px] items-center gap-3 rounded-full border border-black/5 bg-white px-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <Search size={23} className="text-[#252A28]" />

        <input
          type="text"
          placeholder="Search for dishes, cuisines..."
          className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#969A97]"
        />

        <button className="flex h-9 w-9 items-center justify-center rounded-full">
          <SlidersHorizontal size={20} />
        </button>
      </div>
    </div>
  );
}