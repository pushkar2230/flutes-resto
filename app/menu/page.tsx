"use client";

import Link from "next/link";
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  ChevronRight,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";

import {
  addToCart,
  getCart,
  type CartItem,
} from "@/lib/cart";

/* =========================================================
   TYPES
========================================================= */

type Variant = {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
};

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  foodType: "VEG" | "NON_VEG";
  isBestSeller: boolean;
  isRecommended: boolean;
  variants: Variant[];
};

type Category = {
  id: string;
  name: string;
  image: string | null;
  displayOrder: number;
  items: MenuItem[];
};

/* =========================================================
   SEARCH HELPERS
========================================================= */

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatMenuItemName(name: string) {
  return name
    .replace(/([a-zA-Z])(\d+)/g, "$1 $2")
    .replace(/(\d+)([a-zA-Z])/g, "$1 $2")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string) {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function wordMatches(
  queryWord: string,
  itemWord: string
) {
  if (!queryWord || !itemWord) {
    return false;
  }

  /* Direct match */
  if (
    itemWord.includes(queryWord) ||
    queryWord.includes(itemWord)
  ) {
    return true;
  }

  /* Small spelling mistakes */
  const distance = levenshtein(
    queryWord,
    itemWord
  );

  const maxLength = Math.max(
    queryWord.length,
    itemWord.length
  );

  if (maxLength <= 4) {
    return distance <= 1;
  }

  if (maxLength <= 7) {
    return distance <= 2;
  }

  return distance <= 3;
}

function fuzzyItemMatch(
  item: MenuItem,
  search: string
) {
  const query = normalizeSearchText(search);

  if (!query) {
    return true;
  }

  const searchableText = normalizeSearchText(
    `${item.name} ${item.description ?? ""}`
  );

  /* Normal full-text match */
  if (searchableText.includes(query)) {
    return true;
  }

  const queryWords = query.split(" ");
  const itemWords = searchableText.split(" ");

  /*
   * Every searched word should match
   * some word in item name/description.
   *
   * Example:
   *
   * corn cheese ball
   *
   * matches:
   *
   * cheese corn ball
   */
  const allWordsMatch = queryWords.every(
    (queryWord) =>
      itemWords.some((itemWord) =>
        wordMatches(queryWord, itemWord)
      )
  );

  if (allWordsMatch) {
    return true;
  }

  /*
   * Handle joined words.
   *
   * chicken65
   * chicken 65
   *
   * cheese-corn
   * cheese corn
   */
  const compactQuery = query.replace(/\s/g, "");
  const compactItem = searchableText.replace(
    /\s/g,
    ""
  );

  if (
    compactItem.includes(compactQuery) ||
    compactQuery.includes(compactItem)
  ) {
    return true;
  }

  return false;
}

/* =========================================================
   MENU PAGE
========================================================= */

export default function MenuPage() {
  const searchParams = useSearchParams();
  const categoryFromUrl =
    searchParams.get("category");

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [activeCategory, setActiveCategory] =
    useState("");

  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] =
    useState<MenuItem | null>(null);

  const [cartCount, setCartCount] =
    useState(0);

  /* =======================================================
     LOAD CART COUNT
  ======================================================= */

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();

      const count = cart.reduce(
        (total, item) =>
          total + item.quantity,
        0
      );

      setCartCount(count);
    };

    updateCartCount();

    window.addEventListener(
      "cart-updated",
      updateCartCount
    );

    return () => {
      window.removeEventListener(
        "cart-updated",
        updateCartCount
      );
    };
  }, []);


  useEffect(() => {
    if (!categories.length) return;

    if (
      categoryFromUrl &&
      categories.some(
        (category) =>
          category.id === categoryFromUrl
      )
    ) {
      setActiveCategory(categoryFromUrl);
    } else if (!activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [
    categories,
    categoryFromUrl,
    activeCategory,
  ]);

  /* =======================================================
     LOAD MENU
  ======================================================= */

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const response = await fetch(
          "/api/menu"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load menu"
          );
        }

        const data = await response.json();

        if (data.success) {
          const loadedCategories: Category[] =
            data.categories ?? [];

          setCategories(
            loadedCategories
          );

          if (data.categories.length > 0) {
            const categoryExists = data.categories.some(
              (category: Category) =>
                category.id === categoryFromUrl
            );

            if (categoryExists) {
              setActiveCategory(categoryFromUrl!);
            } else {
              setActiveCategory(data.categories[0].id);
            }
          }
        }
      } catch (error) {
        console.error(
          "MENU LOAD ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  /* =======================================================
     SEARCH FILTER
  ======================================================= */

  const filteredCategories =
    useMemo(() => {
      if (!search.trim()) {
        return categories;
      }

      return categories
        .map((category) => ({
          ...category,

          items: category.items.filter(
            (item) =>
              fuzzyItemMatch(
                item,
                search
              )
          ),
        }))
        .filter(
          (category) =>
            category.items.length > 0
        );
    }, [categories, deferredSearch]);

  /* =======================================================
     ACTIVE CATEGORY
  ======================================================= */

  const activeItems =
    filteredCategories.find(
      (category) =>
        category.id === activeCategory
    )?.items ?? [];

  const activeCategoryName =
    categories.find(
      (category) =>
        category.id === activeCategory
    )?.name ?? "";

  /* =======================================================
     ADD ITEM
  ======================================================= */

  const handleAddItem = (
    item: MenuItem
  ) => {
    /*
     * Items having variants should open
     * the variant selector first.
     */
    if (item.variants.length > 0) {
      setSelectedItem(item);
      return;
    }

    /*
     * Normal item:
     * directly add to cart.
     */
    addToCart({
      cartId: item.id,

      menuItemId: item.id,

      name: item.name,

      price: item.price,

      quantity: 1,

      image: item.image,

      foodType: item.foodType,
    });

    console.log(
      "ADDED TO CART:",
      item.name
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#F7F8F6] text-[#171A19]">

      <div className="mx-auto min-h-screen w-full max-w-[480px] overflow-hidden bg-[#F7F8F6] shadow-[0_0_40px_rgba(0,0,0,0.08)]">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="bg-[#F7F8F6] px-5 pb-4 pt-5">

          <div className="flex items-center justify-between">

            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm active:scale-95"
            >
              ←
            </Link>

            <div>
              <p className="text-s font-medium text-[#7A817D]">
                Explore
              </p>

              <h1 className="text-[28px] font-extrabold tracking-tight">
                Our Menu
              </h1>
            </div>

            {/* CART */}

            <Link
              href="/cart"
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm transition active:scale-95"
            >
              <ShoppingCart
                size={20}
                className="text-[#0F5143]"
              />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E58A18] px-1 text-[10px] font-extrabold text-white">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>

          </div>

          {/* SEARCH */}

          <div className="mt-4 flex items-center gap-3 rounded-[18px] bg-white px-4 py-3.5 shadow-[0_4px_18px_rgba(0,0,0,0.05)]">

            <Search
              size={19}
              className="shrink-0 text-[#7A817D]"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search dishes..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#9A9F9C]"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F0F2EF]"
              >
                <X size={15} />
              </button>
            )}

          </div>

        </header>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="space-y-4 px-5 pt-4">

            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="h-[118px] animate-pulse rounded-[22px] bg-white"
                />
              )
            )}

          </div>
        )}

        {/* =================================================
            CONTENT
        ================================================= */}

        {!loading && (
          <>

            {/* =================================================
    CATEGORY BAR
================================================= */}

            <div className="sticky top-0 z-30 border-b border-black/5 bg-[#F7F8F6]/95 py-3 backdrop-blur-xl">
              <div className="flex gap-2.5 overflow-x-auto px-5 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {categories.map((category) => {
                  const active = category.id === activeCategory;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        setActiveCategory(category.id);
                        setSearch("");
                      }}
                      className={`shrink-0 whitespace-nowrap rounded-full px-5 py-3 text-[12px] font-extrabold transition-all duration-200 active:scale-95 ${active
                        ? "bg-[#0F5143] text-white shadow-[0_5px_14px_rgba(15,81,67,0.20)]"
                        : "bg-white text-[#555D59] shadow-[0_3px_12px_rgba(0,0,0,0.045)] ring-1 ring-black/[0.025] hover:bg-[#EEF6F2]"
                        }`}
                    >
                      {category.name}
                    </button>
                  );
                })}
              </div>

            </div>

            {/* =================================================
                SEARCH RESULTS
            ================================================= */}

            {search.trim() ? (

              <section className="px-5 pb-32 pt-5">

                <div className="mb-5">

                  <h2 className="text-[22px] font-extrabold">
                    Search Results
                  </h2>

                  <p className="mt-1 text-xs text-[#7A817D]">
                    {filteredCategories.reduce(
                      (total, category) =>
                        total +
                        category.items.length,
                      0
                    )}{" "}
                    dishes found
                  </p>

                </div>

                {filteredCategories.length ===
                  0 ? (

                  <div className="rounded-[22px] bg-white p-10 text-center shadow-sm">

                    <div className="text-4xl">
                      🍽️
                    </div>

                    <p className="mt-3 font-semibold">
                      No dishes found
                    </p>

                    <p className="mt-1 text-xs text-[#7A817D]">
                      Try searching for another dish.
                    </p>

                  </div>

                ) : (

                  <div className="space-y-3">

                    {filteredCategories.flatMap(
                      (category) =>
                        category.items.map(
                          (item) => (
                            <MenuItemCard
                              key={item.id}
                              item={item}
                              onAdd={() =>
                                handleAddItem(
                                  item
                                )
                              }
                            />
                          )
                        )
                    )}

                  </div>

                )}

              </section>

            ) : (

              /* =================================================
                 ACTIVE CATEGORY
              ================================================= */

              <section className="px-5 pb-32 pt-5">

                {activeItems.length ===
                  0 ? (

                  <div className="rounded-[22px] bg-white p-8 text-center shadow-sm">

                    <div className="text-3xl">
                      🍽️
                    </div>

                    <p className="mt-3 font-semibold">
                      No items available
                    </p>

                  </div>

                ) : (

                  <>

                    <div className="mb-5 flex items-end justify-between">

                      <div>

                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#B56A16]">
                          Category
                        </p>

                        <h2 className="mt-1 text-[23px] font-extrabold leading-tight">
                          {activeCategoryName}
                        </h2>

                      </div>

                      <span className="text-xs text-[#7A817D]">
                        {activeItems.length}{" "}
                        items
                      </span>

                    </div>

                    <div className="space-y-3">

                      {activeItems.map(
                        (item) => (
                          <MenuItemCard
                            key={item.id}
                            item={item}
                            onAdd={() =>
                              handleAddItem(
                                item
                              )
                            }
                          />
                        )
                      )}

                    </div>

                  </>

                )}

              </section>

            )}

          </>
        )}

      </div>

      {/* =====================================================
          VARIANT SHEET
      ===================================================== */}

      {selectedItem && (
        <VariantSheet
          item={selectedItem}
          onClose={() =>
            setSelectedItem(null)
          }
        />
      )}

    </main>
  );
}

/* =========================================================
   MENU ITEM CARD
========================================================= */

function MenuItemCard({
  item,
  onAdd,
}: {
  item: MenuItem;
  onAdd: () => void;
}) {
  const hasVariants = item.variants.length > 0;

  return (
    <article className="group relative overflow-hidden rounded-[24px] bg-white p-3 shadow-[0_6px_24px_rgba(0,0,0,0.055)] ring-1 ring-black/[0.025] transition-all duration-200 active:scale-[0.99]">
      <div className="flex gap-3.5">
        {/* IMAGE */}
        <div className="relative h-[112px] w-[112px] shrink-0 overflow-hidden rounded-[20px] bg-[#EEECE7]">
          {item.image ? (
            <img
              src={item.image}
              alt={formatMenuItemName(item.name)}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#F1F2EE] text-4xl">
              {item.foodType === "VEG" ? "🥗" : "🍗"}
            </div>
          )}

          {/* IMAGE GRADIENT */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/25 to-transparent" />

          {/* BESTSELLER */}
          {item.isBestSeller && (
            <span className="absolute bottom-2 left-2 rounded-full bg-[#E58A18] px-2.5 py-1 text-[9px] font-extrabold tracking-wide text-white shadow-md">
              BESTSELLER
            </span>
          )}
        </div>

        {/* DETAILS */}
        <div className="flex min-w-0 flex-1 flex-col py-0.5">
          {/* NAME */}
          <div className="flex items-start gap-2">
            {/* VEG / NON-VEG */}
            <span
              className={`mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border-2 ${item.foodType === "VEG"
                ? "border-green-600"
                : "border-red-600"
                }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${item.foodType === "VEG"
                  ? "bg-green-600"
                  : "bg-red-600"
                  }`}
              />
            </span>

            <h3 className="line-clamp-2 pr-1 text-[16px] font-extrabold leading-[1.25] tracking-[-0.01em] text-[#171A19]">
              {formatMenuItemName(item.name)}
            </h3>
          </div>

          {/* DESCRIPTION */}
          {item.description && (
            <p className="mt-1.5 line-clamp-2 text-[11px] leading-[1.45] text-[#7A817D]">
              {item.description}
            </p>
          )}

          {/* BOTTOM */}
          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[18px] font-extrabold tracking-tight text-[#171A19]">
                  ₹{item.price}
                </span>

                {hasVariants && (
                  <span className="text-[10px] font-medium text-[#8A918D]">
                    {item.variants.length} options
                  </span>
                )}
              </div>
            </div>

            {/* ADD BUTTON */}
            <button
              type="button"
              onClick={onAdd}
              className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-[#0F5143] px-4 text-[11px] font-extrabold tracking-wide text-white shadow-[0_5px_14px_rgba(15,81,67,0.18)] transition-all duration-200 hover:bg-[#0B4539] active:scale-95"
            >
              ADD
              <ChevronRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   VARIANT SHEET
========================================================= */

function VariantSheet({
  item,
  onClose,
}: {
  item: MenuItem;
  onClose: () => void;
}) {
  const availableVariants =
    item.variants.filter(
      (variant) =>
        variant.isAvailable
    );

  const [
    selectedVariant,
    setSelectedVariant,
  ] = useState<Variant | null>(
    availableVariants[0] ?? null
  );

  /* =======================================================
     ADD SELECTED VARIANT
  ======================================================= */

  const handleAdd = () => {
    if (!selectedVariant) {
      return;
    }

    addToCart({
      cartId: `${item.id}-${selectedVariant.id}`,

      menuItemId: item.id,

      variantId: selectedVariant.id,

      name: item.name,

      variantName:
        selectedVariant.name,

      price: selectedVariant.price,

      quantity: 1,

      image: item.image,

      foodType: item.foodType,
    });

    console.log(
      "ADDED VARIANT TO CART:",
      item.name,
      selectedVariant.name
    );

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
    >

      <div
        className="w-full max-w-[480px] rounded-t-[30px] bg-white p-5 shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* HANDLE */}

        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-[#D9DDD9]" />

        {/* HEADER */}

        <div className="flex items-start justify-between gap-4">

          <div className="min-w-0">

            <div className="flex items-start gap-2">

              <span
                className={`mt-1.5 flex h-3 w-3 shrink-0 items-center justify-center rounded-[2px] border-2 ${item.foodType === "VEG"
                  ? "border-green-600"
                  : "border-red-600"
                  }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${item.foodType === "VEG"
                    ? "bg-green-600"
                    : "bg-red-600"
                    }`}
                />
              </span>

              <h2 className="text-[20px] font-extrabold leading-tight">
                {formatMenuItemName(item.name)}
              </h2>

            </div>

            <p className="mt-2 text-xs text-[#7A817D]">
              Choose your preferred option
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3F4F2]"
          >
            <X size={18} />
          </button>

        </div>

        {/* VARIANTS */}

        {availableVariants.length ===
          0 ? (

          <div className="mt-6 rounded-2xl bg-[#F7F8F6] p-5 text-center text-sm text-[#7A817D]">
            No variants available.
          </div>

        ) : (

          <div className="mt-6 space-y-3">

            {availableVariants.map(
              (variant) => {
                const selected =
                  selectedVariant?.id ===
                  variant.id;

                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() =>
                      setSelectedVariant(
                        variant
                      )
                    }
                    className={`flex w-full items-center justify-between rounded-[18px] border p-4 text-left transition-all active:scale-[0.99] ${selected
                      ? "border-[#0F5143] bg-[#EEF6F2]"
                      : "border-[#E7E9E6] bg-white"
                      }`}
                  >

                    <div className="flex items-center gap-3">

                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selected
                          ? "border-[#0F5143]"
                          : "border-[#B9BFBB]"
                          }`}
                      >
                        {selected && (
                          <div className="h-2.5 w-2.5 rounded-full bg-[#0F5143]" />
                        )}
                      </div>

                      <span className="text-sm font-bold">
                        {variant.name}
                      </span>

                    </div>

                    <span className="text-[16px] font-extrabold">
                      ₹{variant.price}
                    </span>

                  </button>
                );
              }
            )}

          </div>

        )}

        {/* ADD TO CART */}

        <button
          type="button"
          disabled={!selectedVariant}
          onClick={handleAdd}
          className="mt-6 flex w-full items-center justify-between rounded-full bg-[#0F5143] px-6 py-4 text-white transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >

          <span className="font-bold">
            Add to Cart
          </span>

          <span className="font-extrabold">
            ₹
            {selectedVariant?.price ??
              0}
          </span>

        </button>

        <div className="h-2" />

      </div>

    </div>
  );
}