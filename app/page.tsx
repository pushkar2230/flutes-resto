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

type FoodType = "ALL" | "VEG" | "NON_VEG";

export default function HomePage() {
  const [foodType, setFoodType] = useState<FoodType>("ALL");

  return (
    <main className="min-h-screen w-full bg-[#F7F8F6] text-[#171A19]">
      <div className="mx-auto min-h-screen w-full overflow-hidden bg-[#F7F8F6] md:max-w-[480px]">
        <Header />

        <div className="relative z-20 -mt-1">
          <SearchBar />
        </div>

        <HeroBanner />

        <FoodTypeToggle
          foodType={foodType}
          onFoodTypeChange={setFoodType}
        />

        <CategorySlider />

        <BestSellerSection foodType={foodType} />

        <MenuPreview />

        <div className="h-32" />

        <FloatingCart />

        <BottomNavigation />
      </div>
    </main>
  );
}