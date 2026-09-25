"use client";

import Link from "next/link";
import {
    ArrowLeft,
    ShoppingBag,
} from "lucide-react";

export default function OrdersPage() {
    return (
        <main className="min-h-screen w-full bg-[#EDEFEA] text-[#171A19]">
            <div className="mx-auto min-h-screen w-full max-w-[480px] bg-[#F7F8F6]">

                <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-[#F7F8F6]/95 px-5 pb-4 pt-5 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            aria-label="Back to home"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.06] bg-white shadow-sm"
                        >
                            <ArrowLeft size={20} />
                        </Link>

                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#B56B16]">
                                FLUTES RESTO
                            </p>

                            <h1 className="mt-0.5 text-[24px] font-extrabold tracking-[-0.04em]">
                                Order Again
                            </h1>
                        </div>
                    </div>
                </header>

                <section className="flex min-h-[calc(100vh-100px)] flex-col items-center justify-center px-6 pb-28 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#EEF6F2]">
                        <ShoppingBag
                            size={34}
                            strokeWidth={1.8}
                            className="text-[#0F5143]"
                        />
                    </div>

                    <h2 className="mt-6 text-[22px] font-extrabold tracking-[-0.03em]">
                        No previous orders
                    </h2>

                    <p className="mt-2 max-w-[310px] text-[14px] leading-6 text-[#737A76]">
                        Your previous orders will appear here. Once you place an
                        order, you can quickly order your favourites again.
                    </p>

                    <Link
                        href="/menu"
                        className="mt-7 flex h-12 items-center justify-center gap-2 rounded-full bg-[#0F5143] px-7 text-[14px] font-bold text-white shadow-[0_10px_25px_rgba(15,81,67,0.18)] transition-transform active:scale-[0.98]"
                    >
                        <ShoppingBag size={18} />
                        Explore Menu
                    </Link>
                </section>
            </div>
        </main>
    );
}