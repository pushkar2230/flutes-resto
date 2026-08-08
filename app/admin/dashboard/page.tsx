import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    "flutes_admin_session"
  )?.value;

  if (!token) {
    redirect("/admin/login");
  }

  const admin = await verifyAdminToken(token);

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#F5F6F4] p-6">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <p className="text-sm text-gray-500">
            Flutes Resto & Bar
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[#073F35]">
            Admin Dashboard
          </h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <DashboardCard
            title="Orders Today"
            value="0"
          />

          <DashboardCard
            title="Revenue Today"
            value="₹0"
          />

          <DashboardCard
            title="Pending Orders"
            value="0"
          />

          <DashboardCard
            title="Menu Items"
            value="0"
          />

        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">
            Quick Actions
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">

            <a
              href="/admin/dashboard/menu"
              className="rounded-xl bg-[#073F35] px-5 py-3 text-sm font-bold text-white"
            >
              Manage Menu
            </a>

            <a
              href="/admin/dashboard/orders"
              className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-bold"
            >
              View Orders
            </a>

            <a
              href="/admin/dashboard/analytics"
              className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-bold"
            >
              Analytics
            </a>

          </div>
        </div>

      </div>
    </main>
  );
}

function DashboardCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-[#073F35]">
        {value}
      </p>
    </div>
  );
}