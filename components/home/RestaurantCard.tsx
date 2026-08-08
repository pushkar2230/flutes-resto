import { MapPin, Star, Clock } from "lucide-react";

export default function RestaurantCard() {
  return (
    <section className="section">

      <div className="bg-white rounded-3xl p-5 shadow-card">

        <h1 className="text-3xl font-bold text-[#1F4E45]">
          Flutes Resto & Bar
        </h1>

        <div className="flex items-center gap-3 mt-3 text-sm">

          <span className="flex items-center gap-1">

            <Star
              size={16}
              fill="#facc15"
              className="text-yellow-400"
            />

            4.7

          </span>

          <span className="flex items-center gap-1">

            <Clock size={16} />

            25-35 mins

          </span>

        </div>

        <div className="mt-3 flex items-center gap-2 text-gray-600">

          <MapPin size={16}/>

          Wakad

        </div>

      </div>

    </section>
  );
}