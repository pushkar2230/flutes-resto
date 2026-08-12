"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function HeroBanner() {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="px-5 pt-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-[245px] overflow-hidden rounded-[28px] bg-[#1B241F]"
      >
        {/* Hero Image */}
        {!imageError ? (
          <Image
            src="/foods/tandoori.jpg"
            alt="Chicken Tandoori"
            fill
            priority
            sizes="(max-width: 480px) 100vw, 480px"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,#70452B_0%,#35271E_35%,#101513_80%)]">
            <div className="absolute right-[-40px] top-[-50px] h-48 w-48 rounded-full bg-[#B56A16]/20 blur-3xl" />
            <div className="absolute bottom-[-60px] right-[-20px] h-52 w-52 rounded-full bg-[#0F5143]/40 blur-3xl" />
          </div>
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/75" />

        {/* Content */}
        <div className="absolute left-6 top-7 text-white">
          <p className="font-serif text-[16px] italic text-[#F2B544]">
            Today&apos;s Special
          </p>

          <h2 className="mt-2 max-w-[210px] text-[30px] font-extrabold leading-[1.05]">
            CHICKEN
            <br />
            TANDOORI
          </h2>

          <p className="mt-3 text-[13px] text-white/80">
            Authentic. Delicious. Irresistible.
          </p>

          <button
            type="button"
            className="mt-5 flex items-center gap-2 rounded-full bg-[#E58A18] px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105"
          >
            Order Now
            <ArrowRight size={17} />
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
        </div>
      </motion.div>
    </section>
  );
}