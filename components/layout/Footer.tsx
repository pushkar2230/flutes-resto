"use client";

import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-[#103F35] text-white">

            {/* Main Footer */}
            <div className="px-5 pb-5 pt-7">

                {/* Brand */}
                <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#D6A34A]">
                            FLUTES RESTO
                        </p>

                        <h2 className="mt-1 text-[20px] font-extrabold leading-tight tracking-[-0.03em]">
                            Flutes Resto &amp; Bar
                        </h2>

                        <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-white/50">
                            <MapPin size={11} strokeWidth={1.8} />
                            <span>Wakad, Pune</span>
                        </div>
                    </div>

                    {/* Logo */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/10">
                        <img
                            src="/logo/flutes-logo.png"
                            alt="Flutes Resto & Bar"
                            className="h-12 w-12 object-contain"
                        />
                    </div>

                </div>

                {/* Short Description */}
                <p className="mt-4 max-w-[300px] text-[10px] leading-[1.6] text-white/45">
                    Good food, great moments and an experience worth coming back for.
                </p>

                {/* Quick Links */}
                <div className="mt-6">

                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#D6A34A]">
                        Quick Links
                    </p>

                    <div className="mt-2.5 flex items-center gap-4 text-[10px] font-medium text-white/60">

                        <Link
                            href="/"
                            className="transition-colors hover:text-white"
                        >
                            Home
                        </Link>

                        <span className="text-white/20">•</span>

                        <Link
                            href="/menu"
                            className="transition-colors hover:text-white"
                        >
                            Menu
                        </Link>

                        <span className="text-white/20">•</span>

                        <Link
                            href="/cart"
                            className="transition-colors hover:text-white"
                        >
                            Cart
                        </Link>

                        <span className="text-white/20">•</span>

                        <Link
                            href="/orders"
                            className="transition-colors hover:text-white"
                        >
                            My Orders
                        </Link>

                    </div>
                </div>

                {/* Contact */}
                <div className="mt-6 flex items-center gap-5 border-t border-white/10 pt-5">

                    {/* Phone */}
                    <a
                        href="tel:+919852331818"
                        className="flex items-center gap-2 text-[10px] font-medium text-white/55 transition-colors hover:text-white"
                    >
                        <Phone
                            size={14}
                            strokeWidth={1.8}
                            className="shrink-0 text-[#D6A34A]"
                        />

                        <span>+91 98523 31818</span>
                    </a>

                    {/* Instagram */}
                    <a
                        href="https://www.instagram.com/fluteresto_bar/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Flutes Resto Instagram"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#D6A34A] transition-colors hover:bg-white/10"
                    >
                        <FaInstagram size={14} />
                    </a>

                </div>

            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 px-5 py-3">

                <div className="flex items-center justify-between gap-3">

                    <p className="shrink-0 text-[8px] text-white/35">
                        © 2026 Flutes Resto
                    </p>

                    {/* ITE Tech Solutions */}
                    <div className="text-right">

                        <p className="text-[7px] uppercase tracking-[0.16em] text-white/30">
                            Powered by
                        </p>

                        <Link
                            href="https://www.itetechsolutions.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block"
                        >
                            <p className="text-[9px] font-bold text-[#D6A34A] transition-opacity hover:opacity-80">
                                ITE Tech Solutions
                            </p>
                        </Link>

                    </div>

                </div>

            </div>

        </footer>
    );
}