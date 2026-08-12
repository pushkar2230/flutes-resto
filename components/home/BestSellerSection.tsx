"use client";

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

export default function BestSellerSection() {
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

  return (
    <section className="pt-8">
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between px-5">
        <h2 className="text-[21px] font-bold text-[#171A19]">
          Best Sellers
        </h2>

        <button
          type="button"
          className="text-sm font-medium text-[#B56A16]"
        >
          View all →
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex gap-3 overflow-hidden px-5 pb-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="min-w-[205px] overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              <div className="h-[145px] animate-pulse bg-[#E8E8E5]" />

              <div className="space-y-3 p-3">
                <div className="h-4 w-3/4 animate-pulse rounded bg-[#E8E8E5]" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-[#E8E8E5]" />
                <div className="h-8 w-full animate-pulse rounded-full bg-[#E8E8E5]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && foods.length === 0 && (
        <div className="mx-5 rounded-2xl border border-[#E7E5DF] bg-white px-5 py-8 text-center">
          <p className="font-semibold text-[#171A19]">
            No best sellers yet
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Best seller dishes will appear here.
          </p>
        </div>
      )}

      {/* Food Cards */}
      {!loading && foods.length > 0 && (
        <div className="flex gap-3 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {foods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
            />
          ))}
        </div>
      )}
    </section>
  );
}