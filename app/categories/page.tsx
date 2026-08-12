"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  Search,
  UtensilsCrossed,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  image: string | null;
  displayOrder: number;
  items?: unknown[];
};

const categoryIcons: Record<string, string> = {
  "Still Spirited Alcohol Free": "🍹",
  "Soup Veg/Non-Veg": "🍲",
  "Quick Bites": "🍟",
  "Asian Veg Appetizer": "🥢",
  "Asian Non-Veg Appetizer": "🍗",
  "Charcoal Grill Veg": "🥗",
  "Charcoal Grill Non-Veg": "🔥",
  "Sea-Food Special": "🦐",
  "Mini Pizza /Pasta": "🍕",
  "Mini Pizza/Pasta": "🍝",
  "Indian Veg Main Course": "🥘",
  "Indian Non-Veg Main Course": "🍛",
  "Assorted Breads": "🫓",
  "Asian Main Course": "🍜",
  Sizzlers: "🔥",
  Thai: "🥢",
  Biryani: "🍚",
  "Rice, Dal & Raita": "🍚",
  Desserts: "🍰",
  Sandwiches: "🥪",
  "Shakes/Smoothies": "🥤",
  "Shakes / Smoothies": "🥤",
  Beverages: "🧃",
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/menu");

        if (!response.ok) {
          throw new Error("Failed to load categories");
        }

        const data = await response.json();

        if (data.success) {
          setCategories(data.categories ?? []);
        }
      } catch (error) {
        console.error("CATEGORY LOAD ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return categories;
    }

    return categories.filter((category) =>
      category.name.toLowerCase().includes(query)
    );
  }, [categories, search]);

  return (
    <main className="min-h-screen bg-[#F7F8F6] text-[#171A19]">
      <div className="mx-auto min-h-screen w-full max-w-[480px] bg-[#F7F8F6] pb-28">

        {/* Header */}
        <header className="px-5 pb-5 pt-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition active:scale-95"
            >
              <ChevronLeft size={21} />
            </Link>

            <div>
              <p className="text-xs font-medium text-[#7A817D]">
                Explore
              </p>

              <h1 className="text-[25px] font-extrabold">
                Categories
              </h1>
            </div>
          </div>

          {/* Search */}
          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm">
            <Search
              size={19}
              className="shrink-0 text-[#7A817D]"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full bg-transparent text-sm text-[#171A19] outline-none placeholder:text-[#9A9F9C]"
            />
          </div>
        </header>

        {/* Intro */}
        {!search && (
          <section className="px-5 pb-5">
            <div className="rounded-[24px] bg-[#0F5143] px-5 py-5 text-white shadow-[0_8px_25px_rgba(15,81,67,0.18)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-white/65">
                    Flutes Resto & Bar
                  </p>

                  <h2 className="mt-1 text-[20px] font-extrabold">
                    What are you craving?
                  </h2>

                  <p className="mt-1 text-xs text-white/70">
                    Explore our complete menu
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                  <UtensilsCrossed size={23} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Content */}
        <section className="px-5">
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-[145px] animate-pulse rounded-[22px] bg-white"
                />
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="rounded-[24px] bg-white px-5 py-12 text-center shadow-sm">
              <div className="text-4xl">🔍</div>

              <h2 className="mt-4 font-bold">
                No category found
              </h2>

              <p className="mt-1 text-sm text-[#7A817D]">
                Try searching for another category.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[19px] font-extrabold">
                  {search ? "Search Results" : "Browse Categories"}
                </h2>

                <span className="text-xs font-medium text-[#7A817D]">
                  {filteredCategories.length} categories
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {filteredCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/menu?category=${encodeURIComponent(
                      category.id
                    )}`}
                    className="group relative overflow-hidden rounded-[22px] bg-white p-4 shadow-[0_5px_20px_rgba(0,0,0,0.05)] transition active:scale-[0.98]"
                  >
                    {/* Icon */}
                    <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#EEF6F2] text-[36px]">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt=""
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        categoryIcons[category.name] ?? "🍽️"
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="mt-4 line-clamp-2 min-h-[40px] text-[14px] font-extrabold leading-tight">
                      {category.name}
                    </h3>

                    {/* Arrow */}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] text-[#7A817D]">
                        Explore dishes
                      </span>

                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F5143] text-white">
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}