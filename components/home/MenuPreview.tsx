"use client";

import Link from "next/link";
import { ArrowRight, Utensils } from "lucide-react";

const menuCategories = [
    {
        name: "Quick Bites",
        subtitle: "Start your meal",
        icon: "🥗",
    },
    {
        name: "Main Course",
        subtitle: "Rich & delicious",
        icon: "🍛",
    },
    {
        name: "Biryani",
        subtitle: "Flavour packed",
        icon: "🍚",
    },
    {
        name: "Desserts",
        subtitle: "Sweet endings",
        icon: "🍰",
    },
];

export default function MenuPreview() {
    return (
        <section className="pt-8">
            {/* Section Header */}
            <div className="mb-4 flex items-end justify-between px-5">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B56A16]">
                        Explore
                    </p>

                    <h2 className="mt-1 text-[21px] font-extrabold text-[#171A19]">
                        Our Menu
                    </h2>
                </div>

                <Link
                    href="/menu"
                    className="flex items-center gap-1 text-sm font-bold text-[#B56A16]"
                >
                    View all
                    <ArrowRight size={15} />
                </Link>
            </div>

            {/* Menu Categories */}
            <div className="flex gap-3 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {menuCategories.map((category) => (
                    <Link
                        key={category.name}
                        href="/menu"
                        className="group min-w-[155px] rounded-[22px] bg-white p-4 shadow-[0_6px_22px_rgba(0,0,0,0.06)] transition active:scale-[0.97]"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF6F2] text-2xl">
                                {category.icon}
                            </div>

                            <ArrowRight
                                size={16}
                                className="mt-1 text-[#A7ADA9] transition group-hover:translate-x-1"
                            />
                        </div>

                        <h3 className="mt-4 text-[14px] font-extrabold text-[#171A19]">
                            {category.name}
                        </h3>

                        <p className="mt-1 text-[11px] text-[#7A817D]">
                            {category.subtitle}
                        </p>
                    </Link>
                ))}

                {/* Full Menu Card */}
                <Link
                    href="/menu"
                    className="flex min-w-[155px] flex-col justify-between rounded-[22px] bg-[#0F5143] p-4 text-white shadow-[0_7px_24px_rgba(15,81,67,0.18)] active:scale-[0.97]"
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                        <Utensils size={21} />
                    </div>

                    <div className="mt-5">
                        <h3 className="text-[14px] font-extrabold">
                            Explore Full Menu
                        </h3>

                        <p className="mt-1 flex items-center gap-1 text-[11px] text-white/70">
                            200+ dishes
                            <ArrowRight size={12} />
                        </p>
                    </div>
                </Link>
            </div>
        </section>
    );
}