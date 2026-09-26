"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type PopularCategory = {
  label: string;
  image: string;
  categoryNames: string[];
};

const popularCategories: PopularCategory[] = [
  {
    label: "Chicken",
    image: "/images/chicken.jpg",
    categoryNames: [
      "Charcoal Grill Non-Veg",
      "Asian Non-Veg Appetizer",
    ],
  },
  {
    label: "Biryani",
    image: "/images/biryani.jpg",
    categoryNames: ["Biryani"],
  },
  {
    label: "Chinese",
    image: "/images/chinese.jpg",
    categoryNames: [
      "Asian Main Course",
      "Asian Veg Appetizer",
    ],
  },
  {
    label: "Starters",
    image: "/images/starters.jpg",
    categoryNames: [
      "Quick Bites",
      "Asian Veg Appetizer",
    ],
  },
  {
    label: "Beverages",
    image: "/images/beverages.jpg",
    categoryNames: ["Beverages"],
  },
  {
    label: "Desserts",
    image: "/images/desserts.jpg",
    categoryNames: ["Desserts"],
  },
];

export default function CategorySlider() {
  return (
    <section className="pt-8">
      {/* =========================
          SECTION HEADER
      ========================== */}
      <div className="mb-5 flex items-end justify-between px-5">
        <div>
          <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#B58A42]">
            Explore
          </p>

          <h2 className="text-[22px] font-semibold tracking-[-0.03em] text-[#171A19]">
            Popular Categories
          </h2>
        </div>

        {/* Explore All Menu */}
        <Link
          href="/menu"
          className="
            flex
            items-center
            gap-1
            rounded-full
            border
            border-[#D9DDD9]
            bg-white
            px-3
            py-1.5
            text-[11px]
            font-semibold
            text-[#103F35]
            shadow-[0_2px_8px_rgba(16,63,53,0.05)]
            transition-all
            active:scale-95
          "
        >
          Explore

          <ArrowUpRight
            size={13}
            strokeWidth={2}
          />
        </Link>
      </div>

      {/* =========================
          CATEGORY SLIDER
      ========================== */}
      <div
        className="
          flex
          gap-4
          overflow-x-auto
          px-5
          pb-3
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {popularCategories.map((category) => {
          const categoryQuery =
            category.categoryNames.join(",");

          const href = `/menu?categories=${encodeURIComponent(
            categoryQuery
          )}`;

          return (
            <Link
              key={category.label}
              href={href}
              aria-label={`Explore ${category.label}`}
              className="
                group
                block
                min-w-[86px]
                text-left
              "
            >
              {/* =========================
                  IMAGE
              ========================== */}
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
                <Image
                  src={category.image}
                  alt={`${category.label} at Flutes Resto`}
                  fill
                  sizes="82px"
                  priority={category.label === "Chicken"}
                  className="
                    object-cover
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                />

                {/* Image shade */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/35
                    via-transparent
                    to-transparent
                  "
                />
              </div>

              {/* =========================
                  CATEGORY NAME
              ========================== */}
              <div
                className="
                  mt-2
                  flex
                  items-center
                  justify-between
                  px-1
                "
              >
                <span
                  className="
                    text-[12px]
                    font-semibold
                    text-[#252A27]
                  "
                >
                  {category.label}
                </span>

                <ArrowUpRight
                  size={11}
                  className="text-[#9A9F9B]"
                  strokeWidth={1.8}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}