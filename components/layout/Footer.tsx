"use client";

import Link from "next/link";
import {
    MapPin,
    Phone,
    ChevronRight,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="mt-6 bg-[#103F35] text-white">
            {/* Main Footer */}
            <div className="px-4 pb-4 pt-6">

                {/* Brand */}
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#D6A34A]">
                            FLUTES RESTO
                        </p>

                        <h2 className="mt-1 text-[22px] font-extrabold leading-tight tracking-[-0.03em]">
                            Flutes Resto &amp; Bar
                        </h2>

                        <p className="mt-0.5 text-[11px] font-medium text-white/55">
                            Wakad, Pune
                        </p>
                    </div>

                    {/* Small Logo */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white/10">
                        <img
                            src="/logo/flutes-logo.png"
                            alt="Flutes Resto"
                            className="h-12 w-12 object-contain"
                        />
                    </div>
                </div>

                {/* Description */}
                <p className="mt-3 max-w-[330px] text-[10px] leading-[1.65] text-white/55">
                    Good food, great moments and an experience worth coming back for.
                </p>

                {/* Quick Links */}
                <div className="mt-5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#D6A34A]">
                        Quick Links
                    </p>

                    <div className="mt-2 grid grid-cols-2 gap-x-4">
                        <FooterLink href="/" label="Home" />
                        <FooterLink href="/menu" label="Menu" />
                        <FooterLink href="/cart" label="Cart" />
                        <FooterLink href="/orders" label="My Orders" />
                    </div>
                </div>

                {/* Contact */}
                <div className="mt-4 space-y-2.5 border-t border-white/10 pt-4">

                    <div className="flex items-center gap-3">
                        <MapPin
                            size={16}
                            strokeWidth={2}
                            className="shrink-0 text-[#D6A34A]"
                        />

                        <span className="text-[10px] font-medium text-white/60">
                            Flutes Resto, Wakad, Pune
                        </span>
                    </div>

                    <a
                        href="tel:+919852331818"
                        className="flex items-center gap-3"
                    >
                        <Phone
                            size={16}
                            strokeWidth={2}
                            className="shrink-0 text-[#D6A34A]"
                        />

                        <span className="text-[10px] font-medium text-white/60">
                            +91 98523 31818
                        </span>
                    </a>

                    <a
                        href="https://www.instagram.com/fluteresto_bar/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3"
                    >
                        <FaInstagram className="shrink-0 text-[16px] text-[#D6A34A]" />

                        <span className="text-[10px] font-medium text-white/60">
                            Follow us on Instagram
                        </span>
                    </a>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 px-4 py-3">
                <div className="flex items-center justify-between gap-3">

                    <p className="shrink-0 text-[8px] text-white/40">
                        © 2026 Flutes Resto
                    </p>

                    <div className="min-w-0 text-right">
                        <p className="text-[7px] uppercase tracking-[0.16em] text-white/30">
                            Powered by
                        </p>

                        <Link
                            href="https://www.ite-techsolutions.com/"
                            target="_blank"
                            rel="noopener noreferrer">

                            <p className="truncate text-[9px] font-bold text-[#D6A34A]">
                                ITE Tech Solutions
                            </p>
                        </Link>
                    </div>

                </div>
            </div>
        </footer>
    );
}

function FooterLink({
    href,
    label,
}: {
    href: string;
    label: string;
}) {
    return (
        <Link
            href={href}
            className="
        group flex items-center justify-between
        border-b border-white/[0.06]
        py-2
      "
        >
            <span className="text-[10px] font-medium text-white/60 transition-colors group-hover:text-white">
                {label}
            </span>

            <ChevronRight
                size={12}
                className="text-white/25 transition-transform group-hover:translate-x-0.5"
            />
        </Link>
    );
}