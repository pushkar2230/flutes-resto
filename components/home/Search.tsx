import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <section className="-mt-6 px-5">

      <div className="flex items-center rounded-2xl bg-white px-5 py-4 shadow-xl">

        <Search
          size={22}
          className="text-gray-500"
        />

        <input
          placeholder="Search Chicken Biryani..."
          className="ml-4 w-full bg-transparent outline-none"
        />

      </div>

    </section>
  );
}