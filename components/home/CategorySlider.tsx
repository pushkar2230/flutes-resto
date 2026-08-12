"use client";

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
    <section className="pt-7">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between px-5">
        <h2 className="text-[21px] font-bold text-[#171A19]">
          Popular Categories
        </h2>

        <button
          type="button"
          className="text-sm font-medium text-[#B56A16]"
        >
          View all →
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex gap-5 overflow-hidden px-5 pb-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex min-w-[68px] flex-col items-center gap-2"
            >
              <div className="h-[64px] w-[64px] animate-pulse rounded-full border-4 border-white bg-[#E5E6E3] shadow-md" />

              <div className="h-3 w-14 animate-pulse rounded bg-[#E5E6E3]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {popularCategories.map((category) => (
            <button
              key={category.label}
              type="button"
              className="flex min-w-[68px] flex-col items-center gap-2"
            >
              {/* Category Image */}
              <div className="relative h-[64px] w-[64px] overflow-hidden rounded-full border-4 border-white bg-[#EDEBE6] shadow-md">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.label}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#E8EEE9] to-[#D8E3DE]">
                    <span className="text-[25px]">
                      {getCategoryEmoji(category.label)}
                    </span>
                  </div>
                )}
              </div>

              <span className="whitespace-nowrap text-[12px] font-medium text-[#353A37]">
                {category.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function getCategoryEmoji(label: string) {
  switch (label) {
    case "Chicken":
      return "🍗";

    case "Biryani":
      return "🍚";

    case "Chinese":
      return "🥢";

    case "Starters":
      return "🍽️";

    case "Beverages":
      return "🥤";

    case "Desserts":
      return "🍰";

    default:
      return "🍴";
  }
}