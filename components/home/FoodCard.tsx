"use client";

import { Heart, Plus, Star } from "lucide-react";

type Food = {
  id?: string;
  name: string;
  price: number;
  rating?: string;
  image: string | null;

  description?: string | null;
  foodType?: "VEG" | "NON_VEG";
  categoryId?: string;
  categoryName?: string;

  variants?: {
    id: string;
    name: string;
    price: number;
    isAvailable: boolean;
  }[];
};

export default function FoodCard({
  food,
}: {
  food: Food;
}) {
  return (
    <article className="min-w-[180px] overflow-hidden rounded-[22px] bg-white shadow-[0_6px_22px_rgba(0,0,0,0.07)]">
      {/* Image */}
      <div className="relative h-[150px]">
        {food.image ? (
          <img
            src={food.image}
            alt={food.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#EEF2EF]">
            <span className="text-sm font-medium text-[#6B7772]">
              No image
            </span>
          </div>
        )}

        {/* Favourite */}
        <button
          type="button"
          aria-label={`Add ${food.name} to favourites`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm"
        >
          <Heart size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <h3 className="truncate text-[15px] font-bold">
          {food.name}
        </h3>

        {/* Rating - only show when rating exists */}
        {food.rating && (
          <div className="mt-1 flex items-center gap-1 text-xs">
            <Star
              size={13}
              fill="#E6A329"
              className="text-[#E6A329]"
            />
            {food.rating}
          </div>
        )}

        {/* Price + Add */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[17px] font-extrabold">
            ₹{food.price}
          </span>

          <button
            type="button"
            className="flex items-center gap-1 rounded-full bg-[#0F5143] px-3 py-2 text-xs font-bold text-white transition-transform duration-200 hover:scale-105"
          >
            ADD
            <Plus size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}