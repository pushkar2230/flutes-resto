"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  image: string | null;
  displayOrder: number;
};

type PopularCategory = {
  label: string;
  categoryNames: string[];
  image: string | null;
};

const popularCategoryMap = [
  {
    label: "Chicken",
    categoryNames: ["Charcoal Grill Non-Veg", "Asian Non-Veg Appetizer"],
  },
  {
    label: "Biryani",
    categoryNames: ["Biryani"],
  },
  {
    label: "Chinese",
    categoryNames: ["Asian Main Course", "Asian Veg Appetizer"],
  },
  {
    label: "Starters",
    categoryNames: ["Quick Bites", "Asian Veg Appetizer"],
  },
  {
    label: "Beverages",
    categoryNames: ["Beverages"],
  },
  {
    label: "Desserts",
    categoryNames: ["Desserts"],
  },
];

export default function CategorySlider() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch("/api/menu/categories");

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await response.json();

        if (data.success) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const popularCategories: PopularCategory[] =
    popularCategoryMap.map((popular) => {
      const matchedCategory = categories.find((category) =>
        popular.categoryNames.includes(category.name)
      );

      return {
        label: popular.label,
        categoryNames: popular.categoryNames,
        image: matchedCategory?.image ?? null,
      };
    });

  return (
    <section className="pt-8">
      {/* Heading */}
      <div className="mb-5 flex items-end justify-between px-5">
        <div>
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#B58A42]">
            Explore
          </p>

          <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-[#171A19]">
            Popular Categories
          </h2>
        </div>

        <button
          type="button"
          className="
            flex items-center gap-1
            rounded-full
            border border-[#D9DDD9]
            bg-white
            px-3 py-1.5
            text-[11px]
            font-semibold
            text-[#103F35]
            shadow-[0_2px_8px_rgba(16,63,53,0.05)]
          "
        >
          Explore
          <ArrowUpRight size={13} strokeWidth={2} />
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex gap-4 overflow-hidden px-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="min-w-[86px] animate-pulse"
            >
              <div className="h-[82px] w-[82px] rounded-[24px] bg-[#E4E7E3]" />
              <div className="mx-auto mt-2 h-3 w-14 rounded bg-[#E4E7E3]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {popularCategories.map((category) => (
            <button
              key={category.label}
              type="button"
              className="group min-w-[86px] text-left"
            >
              {/* Image tile */}
              <div
                className="
                  relative
                  h-[82px]
                  w-[82px]
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-white
                  bg-[#E8ECE8]
                  shadow-[0_8px_22px_rgba(16,63,53,0.10)]
                "
              >
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.label}
                    fill
                    sizes="82px"
                    className="
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#103F35]">
                    <span className="text-[24px] font-light text-[#D6A34A]">
                      {category.label.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Image shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
              </div>

              {/* Category name */}
              <div className="mt-2 flex items-center justify-between px-1">
                <span className="text-[12px] font-semibold text-[#252A27]">
                  {category.label}
                </span>

                <ArrowUpRight
                  size={11}
                  className="text-[#9A9F9B]"
                  strokeWidth={1.8}
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}