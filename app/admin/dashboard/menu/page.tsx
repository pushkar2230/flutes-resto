"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Power,
  Star,
  Flame,
  Menu,
  X,
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Tags,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import MenuItemModal from "@/components/admin/MenuItemModal";

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  foodType: "VEG" | "NON_VEG";
  image: string | null;
  isAvailable: boolean;
  isBestSeller: boolean;
  isRecommended: boolean;
  displayOrder: number;

  category: {
    id: string;
    name: string;
  };

  variants: {
    id: string;
    name: string;
    price: string | number;
    isAvailable: boolean;
  }[];
};

type Category = {
  id: string;
  name: string;
};

export default function MenuManagementPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] =
    useState<MenuItem | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [foodFilter, setFoodFilter] = useState("ALL");

  async function loadMenu() {
    try {
      setLoading(true);

      const [menuResponse, categoryResponse] =
        await Promise.all([
          fetch("/api/admin/menu", {
            cache: "no-store",
          }),
          fetch("/api/admin/categories", {
            cache: "no-store",
          }),
        ]);

      const menuData = await menuResponse.json();
      const categoryData = await categoryResponse.json();

      if (menuData.success) {
        setItems(menuData.items);
      }

      if (categoryData.success) {
        setCategories(categoryData.categories);
      }
    } catch (error) {
      console.error("MENU LOAD ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMenu();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "ALL" ||
        item.category.id === categoryFilter;

      const matchesFood =
        foodFilter === "ALL" ||
        item.foodType === foodFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesFood
      );
    });
  }, [items, search, categoryFilter, foodFilter]);

  const totalItems = items.length;

  const vegItems = items.filter(
    (item) => item.foodType === "VEG"
  ).length;

  const nonVegItems = items.filter(
    (item) => item.foodType === "NON_VEG"
  ).length;

  const bestSellerItems = items.filter(
    (item) => item.isBestSeller
  ).length;

  async function toggleAvailability(item: MenuItem) {
    try {
      const response = await fetch(
        `/api/admin/menu/${item.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isAvailable: !item.isAvailable,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Update failed.");
        return;
      }

      await loadMenu();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  }

  async function deleteItem(item: MenuItem) {
    const confirmed = window.confirm(
      `Delete "${item.name}" from the menu?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/admin/menu/${item.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Delete failed.");
        return;
      }

      await loadMenu();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  }

  function openAddModal() {
    setEditingItem(null);
    setModalOpen(true);
  }

  function openEditModal(item: MenuItem) {
    setEditingItem(item);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingItem(null);
  }

  return (
    <div className="admin-layout min-h-screen bg-[#F6F7F5] text-[#17221F]">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[270px]
          bg-[#063C32] text-white
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex h-full flex-col">

          {/* BRAND */}
          <div className="flex items-center justify-between px-6 py-7">

            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                Flutes
              </h1>

              <p className="text-sm font-medium text-[#E3A23B]">
                Resto & Bar
              </p>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
            >
              <X size={20} />
            </button>

          </div>

          {/* ADMIN */}
          <div className="mx-4 rounded-2xl bg-white/10 p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E3A23B] text-[#063C32]">
                <Users size={20} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold">
                  Administrator
                </p>

                <p className="text-xs text-green-200">
                  ● Super Admin
                </p>
              </div>

            </div>

          </div>

          {/* NAVIGATION */}
          <nav className="mt-7 flex-1 px-4">

            <NavItem
              icon={<LayoutDashboard size={19} />}
              label="Dashboard"
            />

            <NavItem
              icon={<ShoppingBag size={19} />}
              label="Orders"
            />

            <NavItem
              icon={<UtensilsCrossed size={19} />}
              label="Menu Management"
              active
            />

            <NavItem
              icon={<Tags size={19} />}
              label="Categories"
            />

            <NavItem
              icon={<Users size={19} />}
              label="Customers"
            />

            <NavItem
              icon={<BarChart3 size={19} />}
              label="Analytics"
            />

            <NavItem
              icon={<Settings size={19} />}
              label="Settings"
            />

          </nav>

          {/* LOGOUT */}
          <div className="p-4">

            <button className="flex w-full items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/10">
              <LogOut size={18} />
              Logout
            </button>

          </div>

        </div>
      </aside>

      {/* MAIN */}
      <div className="lg:pl-[270px]">

        {/* TOP BAR */}
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-black/5 bg-white/90 px-4 backdrop-blur md:px-7">

          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl p-2 hover:bg-gray-100 lg:hidden"
          >
            <Menu size={23} />
          </button>

          <div className="hidden lg:block">
            <p className="text-sm text-gray-500">
              Flutes Resto & Bar
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">

            <button className="rounded-xl p-2 text-gray-600 hover:bg-gray-100">
              <Search size={20} />
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#063C32] text-sm font-bold text-white">
              A
            </div>

          </div>

        </header>

        {/* CONTENT */}
        <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">

          {/* PAGE HEADER */}
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">

            <div>
              <p className="text-sm font-semibold text-[#B77722]">
                Menu Management
              </p>

              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#073F35] sm:text-4xl">
                Manage Your Menu
              </h1>

              <p className="mt-2 max-w-xl text-sm text-gray-500 sm:text-base">
                Manage dishes, pricing, photos, availability,
                categories and menu highlights.
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#073F35] px-5 font-bold text-white shadow-sm transition hover:bg-[#095244] xl:w-auto"
            >
              <Plus size={19} />
              Add Menu Item
            </button>

          </div>

          {/* FILTER BAR */}
          <div className="mt-7 rounded-2xl border border-black/5 bg-white p-4 shadow-sm">

            <div className="grid gap-3 lg:grid-cols-[1fr_220px_190px]">

              {/* SEARCH */}
              <div className="flex h-12 items-center rounded-xl border border-black/10 bg-[#FAFAF9] px-4">

                <Search
                  size={19}
                  className="shrink-0 text-gray-400"
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search dishes..."
                  className="ml-3 w-full bg-transparent text-sm outline-none"
                />

              </div>

              {/* CATEGORY */}
              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value)
                }
                className="h-12 rounded-xl border border-black/10 bg-[#FAFAF9] px-4 text-sm outline-none"
              >
                <option value="ALL">
                  All Categories
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>

              {/* FOOD */}
              <select
                value={foodFilter}
                onChange={(e) =>
                  setFoodFilter(e.target.value)
                }
                className="h-12 rounded-xl border border-black/10 bg-[#FAFAF9] px-4 text-sm outline-none"
              >
                <option value="ALL">
                  Veg & Non-Veg
                </option>

                <option value="VEG">
                  Veg Only
                </option>

                <option value="NON_VEG">
                  Non-Veg Only
                </option>
              </select>

            </div>

          </div>

          {/* STATS */}
          <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">

            <StatCard
              icon={<UtensilsCrossed size={20} />}
              label="Total Items"
              value={totalItems}
              description="All menu items"
            />

            <StatCard
              icon={<span className="text-lg">🌿</span>}
              label="Veg Items"
              value={vegItems}
              description="Vegetarian dishes"
              accent="green"
            />

            <StatCard
              icon={<span className="text-lg">🍗</span>}
              label="Non-Veg Items"
              value={nonVegItems}
              description="Non-vegetarian dishes"
              accent="red"
            />

            <StatCard
              icon={<Star size={20} />}
              label="Best Sellers"
              value={bestSellerItems}
              description="Customer favourites"
              accent="gold"
            />

          </div>

          {/* RESULT COUNT */}
          <div className="mt-7 flex items-center justify-between">

            <div>
              <h2 className="font-bold text-gray-900">
                Menu Items
              </h2>

              <p className="text-xs text-gray-500">
                {filteredItems.length} items displayed
              </p>
            </div>

          </div>

          {/* MENU */}
          <div className="mt-3">

            {loading ? (

              <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
                <p className="text-sm text-gray-500">
                  Loading menu...
                </p>
              </div>

            ) : filteredItems.length === 0 ? (

              <div className="rounded-2xl border border-black/5 bg-white px-5 py-20 text-center shadow-sm">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#063C32]/10">
                  <UtensilsCrossed
                    size={28}
                    className="text-[#063C32]"
                  />
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  Your menu is empty
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                  Add your first dish and start building
                  the live Flutes menu.
                </p>

                <button
                  onClick={openAddModal}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#063C32] px-5 py-3 text-sm font-bold text-white"
                >
                  <Plus size={17} />
                  Add First Item
                </button>

              </div>

            ) : (

              <div className="grid gap-4">

                {filteredItems.map((item) => (
                  <MenuRow
                    key={item.id}
                    item={item}
                    onToggle={() =>
                      toggleAvailability(item)
                    }
                    onDelete={() =>
                      deleteItem(item)
                    }
                    onEdit={() =>
                      openEditModal(item)
                    }
                  />
                ))}

              </div>

            )}

          </div>

        </main>

      </div>

      {/* MODAL */}
      <MenuItemModal
        open={modalOpen}
        item={editingItem}
        categories={categories}
        onClose={closeModal}
        onSaved={loadMenu}
      />

    </div>
  );
}

/* ======================================================
   NAV ITEM
====================================================== */

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${active
        ? "bg-white/10 text-white"
        : "text-white/65 hover:bg-white/5 hover:text-white"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

/* ======================================================
   STAT CARD
====================================================== */

function StatCard({
  icon,
  label,
  value,
  description,
  accent = "default",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
  accent?: "default" | "green" | "red" | "gold";
}) {
  const accentClasses = {
    default: "bg-[#063C32] text-white",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-600",
    gold: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:p-5">

      <div className="flex items-start justify-between gap-3">

        <div>
          <p className="text-xs font-semibold text-gray-500 sm:text-sm">
            {label}
          </p>

          <p className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
            {value}
          </p>

          <p className="mt-1 hidden text-xs text-gray-400 sm:block">
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accentClasses[accent]}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

/* ======================================================
   MENU ROW
====================================================== */

function MenuRow({
  item,
  onToggle,
  onDelete,
  onEdit,
}: {
  item: MenuItem;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

        {/* IMAGE */}
        <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-[#ECEDEA] sm:h-24 sm:w-24">

          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-400">
              No Photo
            </div>
          )}

        </div>

        {/* INFO */}
        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-2">

            <span
              className={`h-3 w-3 shrink-0 rounded-full ${item.foodType === "VEG"
                ? "bg-green-600"
                : "bg-red-600"
                }`}
            />

            <h2 className="font-bold text-gray-900">
              {item.name}
            </h2>

            {item.isBestSeller && (
              <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-700">
                <Star
                  size={11}
                  fill="currentColor"
                />
                Bestseller
              </span>
            )}

            {item.isRecommended && (
              <span className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-700">
                <Flame size={11} />
                Recommended
              </span>
            )}

          </div>

          <p className="mt-1 text-sm text-gray-500">
            {item.category.name}
          </p>

          {item.description && (
            <p className="mt-1 line-clamp-1 text-xs text-gray-400">
              {item.description}
            </p>
          )}

          {item.variants.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.variants.map((variant) => (
                <span
                  key={variant.id}
                  className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold"
                >
                  {variant.name} · ₹
                  {variant.price.toString()}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 font-bold text-[#063C32]">
              ₹{item.price.toString()}
            </p>
          )}

        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between gap-2 border-t border-black/5 pt-3 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">

          <button
            onClick={onToggle}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${item.isAvailable
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
              }`}
          >
            <Power size={13} />
            {item.isAvailable
              ? "Available"
              : "Unavailable"}
          </button>

          <div className="flex gap-2">

            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-xs font-bold hover:bg-gray-50"
            >
              <Pencil size={14} />
              Edit
            </button>

            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} />
              Delete
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}