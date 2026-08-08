"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroBanner() {
  return (
    <section className="px-5 pt-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-[245px] overflow-hidden rounded-[28px]"
      >
        <Image
          src="/foods/chicken-tandoori.jpg"
          alt="Chicken Tandoori"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />

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

          <button className="mt-5 flex items-center gap-2 rounded-full bg-[#E58A18] px-5 py-2.5 text-sm font-bold text-white">
            Order Now
            <ArrowRight size={17} />
          </button>
        </div>

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