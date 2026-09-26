"use client";

import Image from "next/image";
import { Bell, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="relative h-[405px] overflow-hidden bg-[#F7F8F6]">
      {/* =========================================================
          HERO IMAGE
      ========================================================= */}
      <div className="absolute inset-x-0 top-0 h-[370px] overflow-hidden rounded-b-[48px] blur-[1.5px] shadow-[0_12px_35px_rgba(16,63,53,0.10)]">
        <Image
          src="/banners/hero.png"
          alt="Flutes Resto & Bar"
          fill
          priority
          sizes="(max-width: 480px) 100vw, 480px"
          className="object-cover object-center dark:brightness-90"
        />

        {/* Dark luxury overlay */}
        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/10 to-black/80" />

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#F7F8F6] to-transparent" />
      </div>

      {/* =========================================================
          TOP NAVIGATION
      ========================================================= */}
      <div className="absolute left-5 right-5 top-6 z-20 flex items-center justify-between">
        {/* Menu */}
        <button
          type="button"
          aria-label="Menu"
          className="
            flex h-12 w-12 items-center justify-center
            rounded-full
            border border-white/10
            bg-[#073F35]/90
            text-white
            shadow-[0_8px_24px_rgba(0,0,0,0.28)]
            backdrop-blur-sm
            transition-transform
            active:scale-95
          "
        >
          <Menu size={24} strokeWidth={1.8} />
        </button>

        {/* Notification */}
        <button
          type="button"
          aria-label="Notifications"
          className="
            relative
            flex h-12 w-12 items-center justify-center
            rounded-full
            border border-white/10
            bg-[#073F35]/90
            text-white
            shadow-[0_8px_24px_rgba(0,0,0,0.28)]
            backdrop-blur-sm
            transition-transform
            active:scale-95
          "
        >
          <Bell size={22} strokeWidth={1.8} />

          {/* Notification dot */}
          <span className="absolute right-[8px] top-[7px] h-2.5 w-2.5 rounded-full bg-[#F2B544] ring-2 ring-[#073F35]" />
        </button>
      </div>

      {/* =========================================================
          BRANDING
      ========================================================= */}
      <div className="absolute inset-x-0 top-[62px] z-10 flex flex-col items-center text-center">
        <Image
          src="/logo/flutes-logo.png"
          alt="Flutes Resto & Bar Logo"
          width={190}
          height={135}
          priority
          sizes="190px"
          className="
            h-[175px]
            w-auto
            object-contain
            drop-shadow-[0_10px_28px_rgba(0,0,0,0.7)]
          "
        />

        <p
          className="
            -mt-1
            text-[14px]
            font-medium
            tracking-[0.08em]
            text-white
            drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]
          "
        >
          Premium Dining Experience
        </p>
      </div>

      {/* =========================================================
          RESTAURANT INFO BAR
      ========================================================= */}
      <div className="absolute bottom-[16px] left-5 right-5 z-30">
        <div
          className="
            grid grid-cols-4
            overflow-hidden
            rounded-[27px]
            border border-white/10
            bg-[#073F35]/95
            px-2
            py-4
            text-center
            text-white
            shadow-[0_10px_35px_rgba(0,0,0,0.25)]
            backdrop-blur-md
          "
        >
          <InfoItem
            value="4.8"
            label="Ratings"
            icon="★"
          />

          <InfoItem
            value="25–35 min"
            label="Delivery"
            icon="◷"
          />

          <InfoItem
            value="Wakad"
            label="Location"
            icon="⌖"
          />

          <InfoItem
            value="Open"
            label="Now"
            icon="●"
            green
          />
        </div>
      </div>
    </header>
  );
}

/* ===============================================================
   INFO ITEM
================================================================ */

function InfoItem({
  value,
  label,
  icon,
  green,
}: {
  value: string;
  label: string;
  icon: string;
  green?: boolean;
}) {
  return (
    <div
      className="
        border-r border-white/15
        px-1
        last:border-r-0
      "
    >
      <div className="flex items-center justify-center gap-1.5">
        <span
          className={
            green
              ? "text-[17px] text-emerald-400"
              : "text-[17px] text-[#F2B544]"
          }
        >
          {icon}
        </span>

        <span className="whitespace-nowrap text-[13px] font-semibold">
          {value}
        </span>
      </div>

      <p
        className="
          mt-1
          text-[9px]
          font-medium
          uppercase
          tracking-[0.08em]
          text-white/60
        "
      >
        {label}
      </p>
    </div>
  );
}