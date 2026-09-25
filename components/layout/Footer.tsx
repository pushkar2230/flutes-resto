"use client";

import Link from "next/link";
import { MapPin, Phone, ChevronRight } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="mt-4 bg-[#103F35] text-white">
            {/* Main footer */}
            <div className="px-5 pb-6 pt-8">

                {/* Brand */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#D6A34A]">
                            FLUTES RESTO
                        </p>

                        <h2 className="mt-1 text-[22px] font-extrabold tracking-[-0.03em]">
                            Flutes Resto & Bar, Wakad, Pune
                        </h2>

                        <p className="mt-2 max-w-[270px] text-[10px] leading-5 text-white/60">
                            Good food, great moments and an experience worth coming back
                            for.
                        </p>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                        <span className="text-[15px] font-black text-[#D6A34A]">
                            <Image
                                src="/logo/flutes-logo.png"
                                alt="Flutes Resto & Bar"
                                width={50}
                                height={40}
                            />
                        </span>
                    </div>
                </div>

                {/* Quick links */}
                <div className="mt-7">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#D6A34A]">
                        Quick Links
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-1">
                        <FooterLink href="/" label="Home" />
                        <FooterLink href="/menu" label="Menu" />
                        <FooterLink href="/cart" label="Cart" />
                        <FooterLink href="/orders" label="My Orders" />
                    </div>
                </div>

                {/* Contact */}
                <div className="mt-7 space-y-3 border-t border-white/10 pt-5">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-[#D6A34A]">
                            <MapPin size={14} />
                        </div>

                        <p className="text-[10px] leading-5 text-white/60">
                            Flutes Resto, Wakad, Pune
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-[#D6A34A]">
                            <Phone size={14} />
                        </div>

                        <p className="text-[10px] text-white/60">
                            +91 98523 31818
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="https://www.instagram.com/fluteresto_bar/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="text-[#D6A34A]">
                                <FaInstagram size={14} />
                            </div>
                        </Link>

                        <p className="text-[10px] text-white/60">
                            Follow us on Instagram
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10 px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                    <p className="text-[9px] text-white/40">
                        © 2026 Flutes Resto
                    </p>

                    <div className="text-right">
                        <p className="text-[8px] uppercase tracking-[0.12em] text-white/30">
                            Powered by
                        </p>
                        <Link
                            href="https://www.ite-techsolutions.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <p className="mt-0.5 text-[9px] font-bold text-[#D6A34A]">
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
            className="group flex items-center justify-between border-b border-white/5 py-2.5"
        >
            <span className="text-[10px] font-medium text-white/65 transition-colors group-hover:text-white">
                {label}
            </span>

            <ChevronRight
                size={12}
                className="text-white/20 transition-transform group-hover:translate-x-0.5"
            />
        </Link>
    );
}