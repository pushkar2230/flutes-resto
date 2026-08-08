import Header from "@/components/home/Header";
import SearchBar from "@/components/home/SearchBar";
import HeroBanner from "@/components/home/HeroBanner";
import FoodTypeToggle from "@/components/home/FoodTypeToggle";
import CategorySlider from "@/components/home/CategorySlider";
import BestSellerSection from "@/components/home/BestSellerSection";
import FloatingCart from "@/components/home/FloatingCart";
import BottomNavigation from "@/components/layout/BottomNavigation";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F8F6] text-[#171A19]">
      <div className="mx-auto min-h-screen max-w-[480px] overflow-hidden bg-[#F7F8F6]">
        <Header />

        <div className="relative z-20 -mt-1">
          <SearchBar />
        </div>

        <HeroBanner />

        <FoodTypeToggle />

        <CategorySlider />

        <BestSellerSection />

        <div className="h-32" />

        <FloatingCart />
        <BottomNavigation />
      </div>
    </main>
  );
}