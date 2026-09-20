"use client";

import Image from "next/image";
import { Bell, Menu } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="relative h-[355px] overflow-hidden">
      {/* Restaurant hero background */}
      <Image
        src="/banners/hero.png"
        alt="Flutes Resto & Bar"
        fill
        priority
        sizes="(max-width: 480px) 100vw, 480px"
        className="object-cover blur-[2px]"
      />

      {/* Dark premium overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/75" />

      {/* Top controls */}
      <div className="absolute left-5 right-5 top-6 flex items-center justify-between">
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-md">
          <Bell size={21} />
        </button>
      </div>

      {/* Branding */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-x-0 top-[78px] flex flex-col items-center text-center text-white"
      >
        <Image
          src="/logo/flutes-logo.png"
          alt="Flutes Resto & Bar Logo"
          width={190}
          height={135}
          priority
          className="h-[185px] w-auto object-contain mix-blend-screen drop-shadow-2xl invert"
        />

        <p className="-mt-2 text-[15px] font-medium tracking-wide text-white/90">
          Premium Dining Experience
        </p>
      </motion.div>

      {/* Restaurant information */}
      <div className="absolute bottom-0 left-5 right-5">
        <div className="grid grid-cols-4 overflow-hidden rounded-t-[28px] bg-[#103F35]/95 px-3 py-4 text-center text-white shadow-2xl backdrop-blur-md">
          <InfoItem value="4.8" label="Ratings" icon="★" />
          <InfoItem value="25–35 min" label="Delivery" icon="◷" />
          <InfoItem value="Wakad" label="Location" icon="⌖" />
          <InfoItem value="Open" label="Now" icon="●" green />
        </div>
      </div>
    </header>
  );
}

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
    <div className="border-r border-white/20 px-1 last:border-r-0">
      <div className="flex items-center justify-center gap-1 text-[14px] font-semibold">
        <span className={green ? "text-emerald-400" : "text-[#F2B544]"}>
          {icon}
        </span>
        <span>{value}</span>
      </div>

      <p className="mt-1 text-[10px] text-white/70">{label}</p>
    </div>
  );
}