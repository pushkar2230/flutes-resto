"use client";

import Link from "next/link";
import {
  Suspense,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  Check,
  ChevronRight,
  Plus,
  Search,
  ShoppingCart,
  Utensils,
  X,
} from "lucide-react";

import {
  addToCart,
  getCart,
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
        matrix[i][j] = matrix[i - 1][j];
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

  if (
    itemWord.includes(queryWord) ||
    queryWord.includes(itemWord)
  ) {
    return true;
  }

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

  const searchableText =
    normalizeSearchText(
      `${item.name} ${item.description ?? ""}`
    );

  /* Normal full-text match */
  if (searchableText.includes(query)) {
    return true;
  }

  const queryWords = query.split(" ");
  const itemWords =
    searchableText.split(" ");

  /* Word-by-word fuzzy matching */
  const allWordsMatch =
    queryWords.every((queryWord) =>
      itemWords.some((itemWord) =>
        wordMatches(
          queryWord,
          itemWord
        )
      )
    );

  if (allWordsMatch) {
    return true;
  }

  /* Joined-word matching */
  const compactQuery =
    query.replace(/\s/g, "");

  const compactItem =
    searchableText.replace(/\s/g, "");

  if (
    compactItem.includes(compactQuery) ||
    compactQuery.includes(compactItem)
  ) {
    return true;
  }

  return false;
}

/* =========================================================
   MENU PAGE CONTENT
========================================================= */

function MenuPageContent() {
  const searchParams =
    useSearchParams();

  const categoryFromUrl =
    searchParams.get("category");

  const searchFromUrl =
    searchParams.get("search") ?? "";

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [activeCategory, setActiveCategory] =
    useState("");

  const [search, setSearch] =
    useState(searchFromUrl);

  const deferredSearch =
    useDeferredValue(search);

  const [loading, setLoading] =
    useState(true);

  const [selectedItem, setSelectedItem] =
    useState<MenuItem | null>(null);

  const [cartCount, setCartCount] =
    useState(0);

  /* =======================================================
     CART COUNT
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

  /* =======================================================
     SYNC SEARCH WITH URL
  ======================================================= */

  useEffect(() => {
    const urlSearch =
      searchParams.get("search") ?? "";

    setSearch((currentSearch) => {
      if (currentSearch === urlSearch) {
        return currentSearch;
      }

      return urlSearch;
    });
  }, [searchParams]);

  /* =======================================================
     CATEGORY FROM URL
  ======================================================= */

  useEffect(() => {
    if (!categories.length) {
      return;
    }

    if (
      categoryFromUrl &&
      categories.some(
        (category) =>
          category.id === categoryFromUrl
      )
    ) {
      setActiveCategory(
        categoryFromUrl
      );
    } else if (!activeCategory) {
      setActiveCategory(
        categories[0].id
      );
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
        const response =
          await fetch("/api/menu");

        if (!response.ok) {
          throw new Error(
            "Failed to load menu"
          );
        }

        const data =
          await response.json();

        if (data.success) {
          const loadedCategories: Category[] =
            data.categories ?? [];

          setCategories(
            loadedCategories
          );

          if (
            loadedCategories.length > 0
          ) {
            const categoryExists =
              loadedCategories.some(
                (category) =>
                  category.id ===
                  categoryFromUrl
              );

            if (categoryExists) {
              setActiveCategory(
                categoryFromUrl!
              );
            } else {
              setActiveCategory(
                loadedCategories[0].id
              );
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
      if (!deferredSearch.trim()) {
        return categories;
      }

      return categories
        .map((category) => ({
          ...category,

          items: category.items.filter(
            (item) =>
              fuzzyItemMatch(
                item,
                deferredSearch
              )
          ),
        }))
        .filter(
          (category) =>
            category.items.length > 0
        );
    }, [
      categories,
      deferredSearch,
    ]);

  /* =======================================================
     ACTIVE CATEGORY
  ======================================================= */

  const activeItems =
    filteredCategories.find(
      (category) =>
        category.id ===
        activeCategory
    )?.items ?? [];

  const activeCategoryName =
    categories.find(
      (category) =>
        category.id ===
        activeCategory
    )?.name ?? "";

  /* =======================================================
     ADD ITEM
  ======================================================= */

  const handleAddItem = (
    item: MenuItem
  ) => {
    if (item.variants.length > 0) {
      setSelectedItem(item);
      return;
    }

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
    <main className="min-h-screen bg-[#EDEFEA] text-[#171A19]">

      {/* =================================================
          CENTERED MOBILE APP SHELL
      ================================================= */}

      <div
        className="
          mx-auto
          min-h-screen
          w-full
          max-w-[480px]
          overflow-hidden
          bg-[#F7F8F6]
          shadow-[0_0_60px_rgba(16,63,53,0.12)]
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <header
          className="
            bg-[#F7F8F6]
            px-5
            pb-5
            pt-5
          "
        >

          <div className="flex items-center justify-between">

            {/* BACK */}

            <Link
              href="/"
              aria-label="Back to home"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                border-[#E4E7E3]
                bg-white
                text-[#103F35]
                shadow-[0_5px_18px_rgba(16,63,53,0.06)]
                transition-all
                active:scale-95
              "
            >
              <span className="text-[18px]">
                ←
              </span>
            </Link>

            {/* TITLE */}

            <div className="text-center">

              <p
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-[#B58A42]
                "
              >
                Explore
              </p>

              <h1
                className="
                  mt-0.5
                  text-[28px]
                  font-semibold
                  tracking-[-0.04em]
                  text-[#171A19]
                "
              >
                Our Menu
              </h1>

            </div>

            {/* CART */}

            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                border-[#E4E7E3]
                bg-white
                text-[#103F35]
                shadow-[0_5px_18px_rgba(16,63,53,0.06)]
                transition-all
                active:scale-95
              "
            >
              <ShoppingCart
                size={20}
                strokeWidth={1.8}
              />

              {cartCount > 0 && (
                <span
                  className="
                    absolute
                    -right-1
                    -top-1
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-[#B58A42]
                    px-1
                    text-[9px]
                    font-bold
                    text-white
                    ring-2
                    ring-[#F7F8F6]
                  "
                >
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}
            </Link>

          </div>

          {/* SEARCH */}

          <div
            className="
              mt-5
              flex
              h-[58px]
              items-center
              gap-3
              rounded-[20px]
              border
              border-[#E1E5E1]
              bg-white
              px-5
              shadow-[0_8px_28px_rgba(16,63,53,0.065)]
            "
          >

            <Search
              size={21}
              strokeWidth={1.8}
              className="shrink-0 text-[#6F7772]"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search dishes, cuisines..."
              className="
                min-w-0
                flex-1
                bg-transparent
                text-[14px]
                font-medium
                text-[#171A19]
                outline-none
                placeholder:text-[#9A9F9C]
              "
              aria-label="Search dishes"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                aria-label="Clear search"
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F1F3F0]
                  text-[#68706B]
                  transition-transform
                  active:scale-90
                "
              >
                <X
                  size={15}
                  strokeWidth={2}
                />
              </button>
            )}

          </div>

        </header>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="space-y-4 px-5 pt-5">

            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="
                    overflow-hidden
                    rounded-[26px]
                    border
                    border-[#E6E8E4]
                    bg-white
                  "
                >
                  <div className="flex gap-4 p-3.5">

                    <div
                      className="
                        h-[132px]
                        w-[132px]
                        shrink-0
                        animate-pulse
                        rounded-[22px]
                        bg-[#E7E9E5]
                      "
                    />

                    <div
                      className="
                        flex
                        flex-1
                        flex-col
                        justify-between
                        py-1
                      "
                    >

                      <div className="space-y-3">

                        <div className="h-5 w-4/5 animate-pulse rounded bg-[#E7E9E5]" />

                        <div className="h-3 w-full animate-pulse rounded bg-[#EEF0ED]" />

                        <div className="h-3 w-2/3 animate-pulse rounded bg-[#EEF0ED]" />

                      </div>

                      <div className="flex items-end justify-between">

                        <div className="h-6 w-20 animate-pulse rounded bg-[#E7E9E5]" />

                        <div className="h-10 w-20 animate-pulse rounded-full bg-[#E7E9E5]" />

                      </div>

                    </div>

                  </div>
                </div>
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

            <div
              className="
                sticky
                top-0
                z-30
                border-b
                border-[#E2E5E1]
                bg-[#F7F8F6]/95
                py-4
                backdrop-blur-md
              "
            >

              <div
                className="
                  flex
                  gap-2.5
                  overflow-x-auto
                  px-5
                  [scrollbar-width:none]
                  [&::-webkit-scrollbar]:hidden
                "
              >

                {categories.map(
                  (category) => {
                    const active =
                      category.id ===
                      activeCategory;

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          setActiveCategory(
                            category.id
                          );
                          setSearch("");
                        }}
                        className={`
                          shrink-0
                          whitespace-nowrap
                          rounded-full
                          px-5
                          py-3
                          text-[11px]
                          font-semibold
                          transition-all
                          duration-200
                          active:scale-95
                          ${active
                            ? "bg-[#103F35] text-white shadow-[0_6px_18px_rgba(16,63,53,0.18)]"
                            : "border border-[#E3E6E2] bg-white text-[#626A65] shadow-[0_3px_12px_rgba(16,63,53,0.035)]"
                          }
                        `}
                      >
                        {category.name}
                      </button>
                    );
                  }
                )}

              </div>

            </div>

            {/* =================================================
                SEARCH RESULTS
            ================================================= */}

            {search.trim() ? (

              <section className="px-5 pb-32 pt-8">

                <div className="mb-6">

                  <p
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.22em]
                      text-[#B58A42]
                    "
                  >
                    Search
                  </p>

                  <div className="mt-1.5 flex items-end justify-between">

                    <h2
                      className="
                        text-[24px]
                        font-semibold
                        tracking-[-0.035em]
                        text-[#171A19]
                      "
                    >
                      Search Results
                    </h2>

                    <span
                      className="
                        rounded-full
                        bg-white
                        px-3
                        py-1.5
                        text-[9px]
                        font-medium
                        text-[#7A817D]
                        shadow-[0_3px_10px_rgba(16,63,53,0.04)]
                      "
                    >
                      {filteredCategories.reduce(
                        (total, category) =>
                          total +
                          category.items.length,
                        0
                      )}{" "}
                      dishes
                    </span>

                  </div>

                </div>

                {filteredCategories.length ===
                  0 ? (

                  <div
                    className="
                      rounded-[28px]
                      border
                      border-[#E3E6E2]
                      bg-white
                      px-6
                      py-14
                      text-center
                      shadow-[0_8px_28px_rgba(16,63,53,0.045)]
                    "
                  >

                    <div
                      className="
                        mx-auto
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-full
                        bg-[#EEF3EF]
                        text-[#103F35]
                      "
                    >
                      <Search
                        size={24}
                        strokeWidth={1.5}
                      />
                    </div>

                    <p
                      className="
                        mt-5
                        text-[16px]
                        font-semibold
                        text-[#171A19]
                      "
                    >
                      No dishes found
                    </p>

                    <p
                      className="
                        mx-auto
                        mt-2
                        max-w-[250px]
                        text-[11px]
                        leading-5
                        text-[#7A817D]
                      "
                    >
                      Try another dish name,
                      cuisine or ingredient.
                    </p>

                  </div>

                ) : (

                  <div className="space-y-4">

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

              <section className="px-5 pb-32 pt-8">

                {activeItems.length ===
                  0 ? (

                  <div
                    className="
                      rounded-[28px]
                      border
                      border-[#E3E6E2]
                      bg-white
                      p-12
                      text-center
                      shadow-[0_8px_28px_rgba(16,63,53,0.045)]
                    "
                  >

                    <div
                      className="
                        mx-auto
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-full
                        bg-[#EEF3EF]
                        text-[#103F35]
                      "
                    >
                      <Utensils
                        size={24}
                        strokeWidth={1.5}
                      />
                    </div>

                    <p
                      className="
                        mt-5
                        text-[16px]
                        font-semibold
                        text-[#171A19]
                      "
                    >
                      No items available
                    </p>

                    <p
                      className="
                        mt-2
                        text-[11px]
                        text-[#7A817D]
                      "
                    >
                      Please explore another
                      category.
                    </p>

                  </div>

                ) : (

                  <>

                    {/* CATEGORY HEADING */}

                    <div
                      className="
                        mb-6
                        flex
                        items-end
                        justify-between
                      "
                    >

                      <div>

                        <p
                          className="
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.22em]
                            text-[#B58A42]
                          "
                        >
                          Category
                        </p>

                        <h2
                          className="
                            mt-1.5
                            text-[25px]
                            font-semibold
                            leading-tight
                            tracking-[-0.04em]
                            text-[#171A19]
                          "
                        >
                          {activeCategoryName}
                        </h2>

                      </div>

                      <span
                        className="
                          rounded-full
                          bg-white
                          px-3.5
                          py-2
                          text-[9px]
                          font-medium
                          text-[#7A817D]
                          shadow-[0_4px_12px_rgba(16,63,53,0.045)]
                        "
                      >
                        {activeItems.length} items
                      </span>

                    </div>

                    {/* FOOD LIST */}

                    <div className="space-y-4">

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
   PAGE WRAPPER
========================================================= */

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#EDEFEA]">

          <div
            className="
              mx-auto
              min-h-screen
              w-full
              max-w-[480px]
              bg-[#F7F8F6]
              p-5
            "
          >

            <div className="flex justify-between">

              <div className="h-11 w-11 animate-pulse rounded-full bg-white" />

              <div className="h-8 w-32 animate-pulse rounded-lg bg-white" />

              <div className="h-11 w-11 animate-pulse rounded-full bg-white" />

            </div>

            <div className="mt-6 h-[58px] animate-pulse rounded-[20px] bg-white" />

            <div className="mt-6 space-y-4">

              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="
                      h-[160px]
                      animate-pulse
                      rounded-[26px]
                      bg-white
                    "
                  />
                )
              )}

            </div>

          </div>

        </main>
      }
    >
      <MenuPageContent />
    </Suspense>
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
  const hasVariants =
    item.variants.length > 0;

  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-[26px]
        border
        border-[#E4E7E3]
        bg-white
        p-3.5
        shadow-[0_8px_28px_rgba(16,63,53,0.055)]
        transition-all
        duration-200
        active:scale-[0.99]
      "
    >

      <div className="flex gap-4">

        {/* =================================================
            IMAGE
        ================================================= */}

        <div
          className="
            relative
            h-[132px]
            w-[132px]
            shrink-0
            overflow-hidden
            rounded-[22px]
            bg-[#EFF1ED]
          "
        >

          {item.image ? (

            <img
              src={item.image}
              alt={formatMenuItemName(
                item.name
              )}
              loading="lazy"
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-500
                group-hover:scale-[1.04]
              "
            />

          ) : (

            <div
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
                bg-gradient-to-br
                from-[#F5F6F2]
                to-[#E7EAE5]
              "
            >

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#D6A34A]/30
                  bg-white/75
                  text-[#103F35]
                  shadow-sm
                "
              >
                <Utensils
                  size={24}
                  strokeWidth={1.5}
                />
              </div>

            </div>

          )}

          {/* IMAGE OVERLAY */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-black/25
              via-transparent
              to-transparent
            "
          />

          {/* FOOD TYPE */}

          <div className="absolute left-3 top-3">

            <span
              className={`
                flex
                h-6
                w-6
                items-center
                justify-center
                rounded-full
                border
                bg-white/95
                shadow-sm
                ${item.foodType === "VEG"
                  ? "border-[#4B9B63]"
                  : "border-[#C95757]"
                }
              `}
            >
              <span
                className={`
                  h-2.5
                  w-2.5
                  rounded-full
                  ${item.foodType === "VEG"
                    ? "bg-[#247A43]"
                    : "bg-[#B3262E]"
                  }
                `}
              />
            </span>

          </div>

          {/* BESTSELLER */}

          {item.isBestSeller && (

            <span
              className="
                absolute
                bottom-2.5
                left-3
                rounded-full
                border
                border-white/20
                bg-[#103F35]/95
                px-3
                py-1.5
                text-[8px]
                font-bold
                uppercase
                tracking-[0.12em]
                text-[#D6A34A]
                shadow-md
              "
            >
              Bestseller
            </span>

          )}

        </div>

        {/* =================================================
            DETAILS
        ================================================= */}

        <div
          className="
            flex
            min-w-0
            flex-1
            flex-col
            py-0.5
          "
        >

          {/* NAME */}

          <h3
            className="
              line-clamp-2
              pr-1
              text-[16px]
              font-semibold
              leading-[1.3]
              tracking-[-0.015em]
              text-[#171A19]
            "
          >
            {formatMenuItemName(
              item.name
            )}
          </h3>

          {/* DESCRIPTION */}

          {item.description && (

            <p
              className="
                mt-2
                line-clamp-2
                text-[11px]
                leading-[1.5]
                text-[#7C837F]
              "
            >
              {item.description}
            </p>

          )}

          {/* BOTTOM */}

          <div
            className="
              mt-auto
              flex
              items-end
              justify-between
              gap-2
              pt-4
            "
          >

            {/* PRICE */}

            <div className="min-w-0">

              <p
                className="
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.13em]
                  text-[#9A9F9B]
                "
              >
                Starting from
              </p>

              <div
                className="
                  mt-0.5
                  flex
                  items-baseline
                  gap-1.5
                "
              >

                <span
                  className="
                    text-[20px]
                    font-bold
                    tracking-[-0.025em]
                    text-[#171A19]
                  "
                >
                  ₹{item.price}
                </span>

                {hasVariants && (

                  <span
                    className="
                      text-[9px]
                      font-medium
                      text-[#8B918D]
                    "
                  >
                    {item.variants.length}{" "}
                    options
                  </span>

                )}

              </div>

            </div>

            {/* ADD BUTTON */}

            <button
              type="button"
              onClick={onAdd}
              aria-label={`Add ${formatMenuItemName(item.name)} to cart`}
              className="
    group
    flex
    h-11
    shrink-0
    items-center
    gap-2
    rounded-full
    bg-[#103F35]
    pl-1.5
    pr-2.5
    text-white
    shadow-[0_7px_20px_rgba(16,63,53,0.18)]
    transition-all
    duration-200
    hover:bg-[#0B342D]
    hover:shadow-[0_9px_24px_rgba(16,63,53,0.22)]
    active:scale-[0.96]
  "
            >
              {/* PLUS */}
              <span
                className="
      flex
      h-8
      w-8
      items-center
      justify-center
      rounded-full
      bg-white
      text-[#103F35]
      shadow-[0_2px_8px_rgba(0,0,0,0.12)]
      transition-transform
      duration-200
      group-hover:scale-105
    "
              >
                <Plus
                  size={17}
                  strokeWidth={2.4}
                />
              </span>

              {/* ADD */}
              <span
                className="
      text-[11px]
      font-bold
      tracking-[0.02em]
    "
              >
                Add
              </span>

              {/* ARROW */}
              <ChevronRight
                size={15}
                strokeWidth={2.2}
                className="
      text-white/75
      transition-transform
      duration-200
      group-hover:translate-x-0.5
    "
              />
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
  const availableVariants = item.variants.filter(
    (variant) => variant.isAvailable
  );

  const [selectedVariant, setSelectedVariant] =
    useState<Variant | null>(
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
      variantName: selectedVariant.name,
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
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-end
        justify-center
        bg-black/50
        backdrop-blur-[5px]
      "
      onClick={onClose}
    >
      {/* =====================================================
          SHEET
      ===================================================== */}

      <div
        className="
          relative
          w-full
          max-w-[480px]
          overflow-hidden
          rounded-t-[32px]
          border
          border-white/70
          bg-[#FAFBF9]
          shadow-[0_-20px_60px_rgba(0,0,0,0.22)]
        "
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* =================================================
            DRAG HANDLE
        ================================================= */}

        <div className="flex justify-center pt-3">
          <div
            className="
              h-1.5
              w-16
              rounded-full
              bg-[#D5D9D6]
            "
          />
        </div>

        <div
          className="
            max-h-[88vh]
            overflow-y-auto
            px-5
            pb-6
            pt-4
          "
        >
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="flex items-start gap-3">

            {/* FOOD TYPE */}
            <div
              className={`
                mt-1
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-[11px]
                border
                ${item.foodType === "VEG"
                  ? "border-[#247A43] bg-[#EEF8F0]"
                  : "border-[#B3262E] bg-[#FFF1F1]"
                }
              `}
            >
              <span
                className={`
                  flex
                  h-4
                  w-4
                  items-center
                  justify-center
                  rounded-[4px]
                  border-2
                  ${item.foodType === "VEG"
                    ? "border-[#247A43]"
                    : "border-[#B3262E]"
                  }
                `}
              >
                <span
                  className={`
                    h-1.5
                    w-1.5
                    rounded-full
                    ${item.foodType === "VEG"
                      ? "bg-[#247A43]"
                      : "bg-[#B3262E]"
                    }
                  `}
                />
              </span>
            </div>

            {/* TITLE */}
            <div className="min-w-0 flex-1">
              <h2
                className="
                  text-[20px]
                  font-bold
                  leading-[1.2]
                  tracking-[-0.035em]
                  text-[#171A19]
                "
              >
                {formatMenuItemName(item.name)}
              </h2>

              <p
                className="
                  mt-1.5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-[#8A918D]
                "
              >
                Freshly made & crispy
              </p>
            </div>

            {/* CLOSE */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#F0F2EF]
                text-[#303633]
                transition-all
                duration-150
                hover:bg-[#E7EBE7]
                active:scale-90
              "
            >
              <X
                size={20}
                strokeWidth={1.8}
              />
            </button>
          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          {item.description && (
            <p
              className="
                mt-5
                text-[12px]
                leading-5
                text-[#737A76]
              "
            >
              {item.description}
            </p>
          )}

          {/* =================================================
              OPTION TITLE
          ================================================= */}

          <div className="mt-6">
            <p
              className="
                text-[14px]
                font-semibold
                text-[#103F35]
              "
            >
              Choose your preferred option
            </p>

            <p
              className="
                mt-1
                text-[10px]
                text-[#929894]
              "
            >
              Select one option to continue
            </p>
          </div>

          {/* =================================================
              VARIANTS
          ================================================= */}

          {availableVariants.length === 0 ? (
            <div
              className="
                mt-4
                rounded-[20px]
                border
                border-[#E3E6E2]
                bg-white
                px-5
                py-8
                text-center
              "
            >
              <p
                className="
                  text-[13px]
                  font-medium
                  text-[#7A817D]
                "
              >
                No variants available.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
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
                      className={`
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-[20px]
                        border
                        px-4
                        py-4
                        text-left
                        transition-all
                        duration-150
                        active:scale-[0.985]
                        ${selected
                          ? "border-[#103F35] bg-[#EDF7F3] shadow-[0_6px_20px_rgba(16,63,53,0.08)]"
                          : "border-[#E2E6E2] bg-white"
                        }
                      `}
                    >
                      {/* RADIO */}
                      <span
                        className={`
                          flex
                          h-7
                          w-7
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border-2
                          ${selected
                            ? "border-[#0D6757]"
                            : "border-[#C5CBC7]"
                          }
                        `}
                      >
                        {selected && (
                          <span
                            className="
                              h-3.5
                              w-3.5
                              rounded-full
                              bg-[#0D6757]
                            "
                          />
                        )}
                      </span>

                      {/* NAME */}
                      <div className="min-w-0 flex-1">
                        <p
                          className={`
                            text-[15px]
                            font-semibold
                            ${selected
                              ? "text-[#103F35]"
                              : "text-[#252A28]"
                            }
                          `}
                        >
                          {variant.name}
                        </p>

                        {selected && (
                          <div
                            className="
                              mt-1
                              flex
                              items-center
                              gap-1
                              text-[9px]
                              font-medium
                              text-[#71807A]
                            "
                          >
                            <Check
                              size={10}
                              strokeWidth={2.5}
                            />
                            Selected option
                          </div>
                        )}
                      </div>

                      {/* PRICE */}
                      <div className="text-right">
                        <p
                          className="
                            text-[17px]
                            font-bold
                            tracking-[-0.02em]
                            text-[#171A19]
                          "
                        >
                          ₹{variant.price}
                        </p>

                        {selected && (
                          <span
                            className="
                              mt-1
                              inline-flex
                              rounded-full
                              bg-[#DDEFE8]
                              px-2
                              py-0.5
                              text-[8px]
                              font-bold
                              uppercase
                              tracking-[0.08em]
                              text-[#0D6757]
                            "
                          >
                            Selected
                          </span>
                        )}
                      </div>
                    </button>
                  );
                }
              )}
            </div>
          )}

          {/* =================================================
              ADD TO CART
          ================================================= */}

          <button
            type="button"
            disabled={!selectedVariant}
            onClick={handleAdd}
            className="
              mt-5
              flex
              h-[58px]
              w-full
              items-center
              rounded-[18px]
              bg-[#103F35]
              px-5
              text-white
              shadow-[0_10px_28px_rgba(16,63,53,0.22)]
              transition-all
              duration-150
              hover:bg-[#0B342D]
              active:scale-[0.985]
              active:shadow-[0_5px_15px_rgba(16,63,53,0.18)]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {/* CART ICON */}
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-white/10
              "
            >
              <ShoppingCart
                size={19}
                strokeWidth={1.8}
              />
            </div>

            {/* TEXT */}
            <span
              className="
                ml-3
                text-[15px]
                font-semibold
              "
            >
              Add to Cart
            </span>

            {/* DIVIDER */}
            <span
              className="
                ml-auto
                mr-3
                h-6
                w-px
                bg-white/20
              "
            />

            {/* PRICE */}
            <span
              className="
                text-[16px]
                font-bold
              "
            >
              ₹{selectedVariant?.price ?? 0}
            </span>

            <ChevronRight
              size={19}
              className="ml-2 text-white/70"
              strokeWidth={2}
            />
          </button>

          {/* =================================================
              TRUST CHIPS
          ================================================= */}

          <div
            className="
              mt-4
              flex
              gap-2
              overflow-x-auto
              pb-1
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            <div
              className="
                flex
                shrink-0
                items-center
                gap-1.5
                rounded-full
                border
                border-[#E5E9E5]
                bg-white
                px-3
                py-2
                text-[9px]
                font-medium
                text-[#59615C]
              "
            >
              <span className="text-[#0D6757]">
                ✓
              </span>
              Freshly Made
            </div>

            <div
              className="
                flex
                shrink-0
                items-center
                gap-1.5
                rounded-full
                border
                border-[#E5E9E5]
                bg-white
                px-3
                py-2
                text-[9px]
                font-medium
                text-[#59615C]
              "
            >
              <span className="text-[#0D6757]">
                ✓
              </span>
              Hygienically Prepared
            </div>

            <div
              className="
                flex
                shrink-0
                items-center
                gap-1.5
                rounded-full
                border
                border-[#E5E9E5]
                bg-white
                px-3
                py-2
                text-[9px]
                font-medium
                text-[#59615C]
              "
            >
              <span className="text-[#0D6757]">
                ♥
              </span>
              Loved by Many
            </div>
          </div>

          <div className="h-1" />
        </div>
      </div>
    </div>
  );
}