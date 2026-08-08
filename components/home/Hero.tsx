import Image from "next/image";

export default function Hero() {
  return (
    <section className="px-5 mt-6">

      <div className="relative h-56 overflow-hidden rounded-3xl">

        <Image
          src="/banners/banner.jpg"
          alt="Banner"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-6 left-6">

          <p className="text-white text-sm">
            Today's Special
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            Authentic Taste
          </h2>

          <button className="mt-4 rounded-full bg-[#C7772B] px-6 py-3 font-semibold text-white shadow-lg">

            Order Now →

          </button>

        </div>

      </div>

    </section>
  );
}