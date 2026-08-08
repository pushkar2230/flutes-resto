export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--background)] border-b border-[var(--border)]">

      <div className="px-5 pt-5 pb-4">

        <p className="text-sm text-gray-500">
          Welcome 👋
        </p>

        <h1 className="text-3xl font-bold text-[var(--primary)]">
          Flutes Resto
        </h1>

        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">

          📍 Wakad

          <span className="text-green-600 font-semibold">
            • Open Now
          </span>

        </div>

      </div>

    </header>
  );
}