"use client";

import Link from "next/link";
import {
    ArrowUpRight,
    ChefHat,
    Utensils,
    Wheat,
    IceCreamBowl,
} from "lucide-react";

type MenuCategory = {
    name: string;
    subtitle: string;
    icon: typeof Utensils;
    accent: string;
    categories: string[];
};

const menuCategories: MenuCategory[] = [
    {
        name: "Quick Bites",
        subtitle: "Perfect to begin",
        icon: Utensils,
        accent: "bg-[#EAF1ED] text-[#103F35]",
        categories: ["Quick Bites"],
    },
    {
        name: "Main Course",
        subtitle: "Chef-crafted classics",
        icon: ChefHat,
        accent: "bg-[#F4EEE2] text-[#9A6B20]",
        categories: [
            "Indian Veg Main Course",
            "Indian Non-Veg Main Course",
            "Asian Main Course",
            "Thai",
        ],
    },
    {
        name: "Biryani",
        subtitle: "Aromatic & flavourful",
        icon: Wheat,
        accent: "bg-[#EAF1ED] text-[#103F35]",
        categories: ["Biryani"],
    },
    {
        name: "Desserts",
        subtitle: "A perfect ending",
        icon: IceCreamBowl,
        accent: "bg-[#F4EEE2] text-[#9A6B20]",
        categories: ["Desserts"],
    },
];

export default function MenuPreview() {
    return (
        <section className="pt-8">
            {/* =========================
          HEADER
      ========================== */}
            <div className="mb-4 flex items-end justify-between px-5">
                <div>
                    <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#B58A42]">
                        Discover
                    </p>

                    <h2 className="text-[22px] font-semibold tracking-[-0.035em] text-[#171A19]">
                        Our Menu
                    </h2>
                </div>

                <Link
                    href="/menu"
                    className="
            flex
            items-center
            gap-1
            rounded-full
            border
            border-[#DCE1DD]
            bg-white
            px-3
            py-1.5
            text-[11px]
            font-semibold
            text-[#103F35]
            shadow-[0_3px_10px_rgba(16,63,53,0.05)]
            transition-transform
            active:scale-95
          "
                >
                    Full menu
                    <ArrowUpRight
                        size={13}
                        strokeWidth={2}
                    />
                </Link>
            </div>

            {/* =========================
          CATEGORY CARDS
      ========================== */}
            <div
                className="
          flex
          gap-3
          overflow-x-auto
          px-5
          pb-3
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
            >
                {menuCategories.map((category) => {
                    const Icon = category.icon;

                    const categoryQuery =
                        category.categories.join(",");

                    const href = `/menu?categories=${encodeURIComponent(
                        categoryQuery
                    )}`;

                    return (
                        <Link
                            key={category.name}
                            href={href}
                            className="
                group
                relative
                flex
                min-w-[164px]
                flex-col
                overflow-hidden
                rounded-[24px]
                border
                border-[#E2E6E2]
                bg-white
                p-4
                shadow-[0_6px_20px_rgba(23,26,25,0.05)]
                transition-transform
                active:scale-[0.98]
              "
                        >
                            {/* Decorative corner */}
                            <div
                                className="
                  absolute
                  -right-7
                  -top-7
                  h-20
                  w-20
                  rounded-full
                  bg-[#103F35]/[0.025]
                "
                            />

                            {/* Top row */}
                            <div className="relative flex items-start justify-between">
                                <div
                                    className={`
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-[15px]
                    ${category.accent}
                  `}
                                >
                                    <Icon
                                        size={20}
                                        strokeWidth={1.7}
                                    />
                                </div>

                                <div
                                    className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#E4E7E3]
                    text-[#8A918D]
                    transition-colors
                    group-hover:border-[#103F35]
                    group-hover:text-[#103F35]
                  "
                                >
                                    <ArrowUpRight
                                        size={13}
                                        strokeWidth={2}
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative mt-6">
                                <h3
                                    className="
                    text-[14px]
                    font-semibold
                    tracking-[-0.01em]
                    text-[#171A19]
                  "
                                >
                                    {category.name}
                                </h3>

                                <p
                                    className="
                    mt-1
                    text-[10px]
                    leading-4
                    text-[#7A817D]
                  "
                                >
                                    {category.subtitle}
                                </p>
                            </div>

                            {/* Bottom accent */}
                            <div
                                className="
                  mt-4
                  h-[2px]
                  w-7
                  rounded-full
                  bg-[#D6A34A]
                "
                            />
                        </Link>
                    );
                })}

                {/* =========================
            COMPLETE MENU
        ========================== */}
                <Link
                    href="/menu"
                    className="
            group
            relative
            flex
            min-w-[164px]
            flex-col
            overflow-hidden
            rounded-[24px]
            bg-[#103F35]
            p-4
            text-white
            shadow-[0_9px_25px_rgba(16,63,53,0.16)]
            transition-transform
            active:scale-[0.98]
          "
                >
                    {/* Decorative circles */}
                    <div
                        className="
              absolute
              -right-8
              -top-8
              h-24
              w-24
              rounded-full
              border
              border-[#D6A34A]/20
            "
                    />

                    <div
                        className="
              absolute
              -bottom-10
              -left-10
              h-28
              w-28
              rounded-full
              border
              border-white/10
            "
                    />

                    {/* Top row */}
                    <div className="relative flex items-start justify-between">
                        <div
                            className="flex h-11 w-11 items-center justify-center rounded-[15px] border border-white/10 bg-white/10">
                            <Utensils
                                size={20}
                                strokeWidth={1.7}
                                color="white"
                            />
                        </div>

                        <div
                            className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                border
                border-white/15
                text-white/70
              "
                        >
                            <ArrowUpRight
                                size={13}
                                strokeWidth={2}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative mt-6">
                        <p
                            className="
                mb-1
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-[#D6A34A]
              "
                        >
                            Explore
                        </p>

                        <h3
                            className=" text-[15px] font-semibold tracking-[-0.015em] text-white"
                        >
                            Complete Menu
                        </h3>

                        <p className="mt-1 text-[10px] text-white/55">
                            Explore all our dishes
                        </p>
                    </div>

                    {/* Bottom action */}
                    <div
                        className="
              relative
              mt-4
              flex
              items-center
              gap-2
              text-[10px]
              font-semibold
              text-[#D6A34A]
            "
                    >
                        Browse dishes

                        <ArrowUpRight
                            size={13}
                            strokeWidth={2}
                        />
                    </div>
                </Link>
            </div>
        </section>
    );
}