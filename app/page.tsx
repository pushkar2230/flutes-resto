"use client";

import { useState } from "react";

import Header from "@/components/home/Header";
import SearchBar from "@/components/home/SearchBar";
import HeroBanner from "@/components/home/HeroBanner";
import FoodTypeToggle from "@/components/home/FoodTypeToggle";
import CategorySlider from "@/components/home/CategorySlider";
import BestSellerSection from "@/components/home/BestSellerSection";
import MenuPreview from "@/components/home/MenuPreview";
import FloatingCart from "@/components/home/FloatingCart";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Footer from "@/components/layout/Footer";

type FoodType = "ALL" | "VEG" | "NON_VEG";

export default function HomePage() {
  const [foodType, setFoodType] = useState<FoodType>("ALL");

  return (
    <main className="min-h-screen w-full bg-[#EDEFEA] text-[#171A19]">
      {/* Mobile-first restaurant app shell */}
      <div className="relative mx-auto min-h-screen w-full overflow-x-hidden bg-[#F7F8F6] shadow-[0_0_60px_rgba(0,0,0,0.06)] md:max-w-[480px]">

        {/* Header */}
        <Header />

        {/* Search */}
        <div className="relative z-30 -mt-1 px-4">
          <SearchBar />
        </div>

        {/* Main content */}
        <div className="relative">
          {/* Hero */}
          <section className="pt-3">
            <HeroBanner />
          </section>

          {/* Food type */}
          <section className="pt-5">
            <FoodTypeToggle
              foodType={foodType}
              onFoodTypeChange={setFoodType}
            />
          </section>

          {/* Categories */}
          <section className="pt-5">
            <CategorySlider />
          </section>

          {/* Best Sellers */}
          <section className="pt-6">
            <BestSellerSection foodType={foodType} />
          </section>

          <div className="h-5" />

          {/* Menu Preview */}
          <section className="pt-7">
            <MenuPreview />
          </section>

          <div className="h-10" />

          {/* Footer */}
          <section className="pt-16">
            <Footer />
          </section>
        </div>

        <div className="h-15" />
        {/* Floating cart */}
        <FloatingCart />

        {/* Bottom navigation */}
        <BottomNavigation />
      </div>
    </main>
  );
}