"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      router.push("/menu");
      return;
    }

    router.push(`/menu?search=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <div className="px-5 pt-4">
      <div className="flex h-[58px] items-center gap-3 rounded-full border border-black/5 bg-white px-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <Search
          size={23}
          className="shrink-0 cursor-pointer text-[#252A28]"
          onClick={handleSearch}
        />

        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Search for dishes, cuisines..."
          className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#969A97]"
          aria-label="Search menu"
        />

        <button
          type="button"
          aria-label="Open menu filters"
          onClick={() => router.push("/menu")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#252A28] transition-transform active:scale-95"
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>
    </div>
  );
}