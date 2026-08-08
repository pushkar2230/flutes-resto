const categories = [
  { name: "Chicken", image: "/categories/chicken.jpg" },
  { name: "Biryani", image: "/categories/biryani.jpg" },
  { name: "Chinese", image: "/categories/chinese.jpg" },
  { name: "Starters", image: "/categories/starters.jpg" },
  { name: "Beverages", image: "/categories/beverages.jpg" },
  { name: "Desserts", image: "/categories/desserts.jpg" },
];

export default function CategorySlider() {
  return (
    <section className="pt-7">
      <div className="mb-4 flex items-center justify-between px-5">
        <h2 className="text-[21px] font-bold">Popular Categories</h2>

        <button className="text-sm font-medium text-[#B56A16]">
          View all →
        </button>
      </div>

      <div className="flex gap-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => (
          <button
            key={category.name}
            className="flex min-w-[68px] flex-col items-center gap-2"
          >
            <div className="relative h-[64px] w-[64px] overflow-hidden rounded-full border-4 border-white bg-[#EDEBE6] shadow-md">
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover"
              />
            </div>

            <span className="whitespace-nowrap text-[12px] font-medium text-[#353A37]">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}