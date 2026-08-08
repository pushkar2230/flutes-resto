import FoodCard from "./FoodCard";

const foods = [
  {
    name: "Chicken 65",
    price: 459,
    rating: "4.7",
    image: "/foods/chicken65.jpg",
  },
  {
    name: "Mutton Biryani",
    price: 599,
    rating: "4.8",
    image: "/foods/mutton-biryani.jpg",
  },
  {
    name: "Paneer Tikka",
    price: 399,
    rating: "4.6",
    image: "/foods/paneer-tikka.jpg",
  },
];

export default function BestSellerSection() {
  return (
    <section className="pt-8">
      <div className="mb-4 flex items-center justify-between px-5">
        <h2 className="text-[21px] font-bold">Best Sellers</h2>

        <button className="text-sm font-medium text-[#B56A16]">
          View all →
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {foods.map((food) => (
          <FoodCard key={food.name} food={food} />
        ))}
      </div>
    </section>
  );
}