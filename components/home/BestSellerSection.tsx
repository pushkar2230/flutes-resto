"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import FoodCard from "./FoodCard";

type Variant = {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
};

type Food = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  foodType: "VEG" | "NON_VEG";
  categoryId: string;
  categoryName: string;
  isBestSeller: boolean;
  isRecommended: boolean;
  variants: Variant[];
};

type FoodType = "ALL" | "VEG" | "NON_VEG";

type BestSellerSectionProps = {
  foodType: FoodType;
};

export default function BestSellerSection({
  foodType,
}: BestSellerSectionProps) {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBestSellers = async () => {
      try {
        const response = await fetch("/api/menu/best-sellers");

        if (!response.ok) {
          throw new Error("Failed to fetch best sellers");
        }

        const data = await response.json();

        if (data.success) {
          setFoods(data.items);
        }
      } catch (error) {
        console.error("Failed to load best sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBestSellers();
  }, []);

  // Filter admin-selected best sellers by the selected food type
  const filteredFoods =
    foodType === "ALL"
      ? foods
      : foods.filter((food) => food.foodType === foodType);

  const filterLabel =
    foodType === "VEG"
      ? "Vegetarian"
      : foodType === "NON_VEG"
        ? "Non-Vegetarian"
        : "Signature";

  return (
    <section className="pt-9">
      {/* Header */}
      <div className="mb-5 flex items-end justify-between px-5">
        <div>
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#B58A42]">
            {filterLabel} selection
          </p>

          <h2 className="text-[23px] font-semibold tracking-[-0.035em] text-[#171A19]">
            Best Sellers
          </h2>
        </div>

        <button
          type="button"
          className="
            flex items-center gap-1
            text-[12px]
            font-semibold
            text-[#103F35]
          "
        >
          View all
          <ArrowUpRight size={14} strokeWidth={2} />
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex gap-4 overflow-hidden px-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="
                min-w-[178px]
                overflow-hidden
                rounded-[24px]
                border border-[#E6E7E3]
                bg-white
              "
            >
              <div className="h-[150px] animate-pulse bg-[#E6E7E3]" />

              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-[#E6E7E3]" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-[#E6E7E3]" />
                <div className="h-9 w-full animate-pulse rounded-full bg-[#E6E7E3]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No best sellers configured at all */}
      {!loading && foods.length === 0 && (
        <div className="mx-5">
          <div
            className="
              relative
              overflow-hidden
              rounded-[28px]
              border
              border-[#DDE4DF]
              bg-[#103F35]
              px-6
              py-9
              text-center
              shadow-[0_12px_35px_rgba(16,63,53,0.10)]
            "
          >
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full border border-[#D6A34A]/20" />
            <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full border border-white/10" />

            <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#D6A34A]/40 bg-white/5 text-[#D6A34A]">
              <Sparkles size={19} strokeWidth={1.5} />
            </div>

            <p className="relative mt-4 text-[16px] font-semibold text-white">
              Signature dishes
            </p>

            <p className="relative mx-auto mt-2 max-w-[260px] text-[11px] leading-5 text-white/60">
              Our specially selected favourites will appear here.
            </p>

            <div className="relative mx-auto mt-5 h-px w-12 bg-[#D6A34A]/50" />
          </div>
        </div>
      )}

      {/* Best sellers exist, but none match selected filter */}
      {!loading && foods.length > 0 && filteredFoods.length === 0 && (
        <div className="mx-5">
          <div
            className="
              rounded-[24px]
              border border-[#E1E5E1]
              bg-white
              px-6
              py-8
              text-center
              shadow-[0_8px_24px_rgba(16,63,53,0.05)]
            "
          >
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#F4EEE2] text-[#B58A42]">
              <Sparkles size={18} strokeWidth={1.5} />
            </div>

            <p className="mt-4 text-[15px] font-semibold text-[#171A19]">
              No {foodType === "VEG" ? "vegetarian" : "non-vegetarian"} best
              sellers yet
            </p>

            <p className="mx-auto mt-2 max-w-[250px] text-[11px] leading-5 text-[#7A817C]">
              More signature dishes will appear here as they are selected by
              the restaurant.
            </p>
          </div>
        </div>
      )}

      {/* Actual filtered Best Sellers */}
      {!loading && filteredFoods.length > 0 && (
        <div className="flex gap-4 overflow-x-auto px-5 pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filteredFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
    </section>
  );
}