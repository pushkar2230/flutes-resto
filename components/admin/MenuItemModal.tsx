"use client";

import { FormEvent, useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

type Category = {
  id: string;
  name: string;
};

type Variant = {
  id?: string;
  name: string;
  price: string;
};

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
  }[];
};

type Props = {
  open: boolean;
  item: MenuItem | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
};

export default function MenuItemModal({
  open,
  item,
  categories,
  onClose,
  onSaved,
}: Props) {
  const editing = Boolean(item);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [foodType, setFoodType] = useState<"VEG" | "NON_VEG">("VEG");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isRecommended, setIsRecommended] = useState(false);
  const [displayOrder, setDisplayOrder] = useState("0");

  const [variants, setVariants] = useState<Variant[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    if (item) {
      setName(item.name);
      setDescription(item.description ?? "");
      setCategoryId(item.category.id);
      setFoodType(item.foodType);
      setPrice(item.price.toString());
      setImage(item.image ?? "");
      setIsAvailable(item.isAvailable);
      setIsBestSeller(item.isBestSeller);
      setIsRecommended(item.isRecommended);
      setDisplayOrder(item.displayOrder.toString());

      setVariants(
        item.variants.map((variant) => ({
          id: variant.id,
          name: variant.name,
          price: variant.price.toString(),
        }))
      );
    } else {
      setName("");
      setDescription("");
      setCategoryId(categories[0]?.id ?? "");
      setFoodType("VEG");
      setPrice("");
      setImage("");
      setIsAvailable(true);
      setIsBestSeller(false);
      setIsRecommended(false);
      setDisplayOrder("0");
      setVariants([]);
    }

    setError("");
  }, [open, item, categories]);

  if (!open) return null;

  function addVariant() {
    setVariants((current) => [
      ...current,
      {
        name: "",
        price: "",
      },
    ]);
  }

  function removeVariant(index: number) {
    setVariants((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  function updateVariant(
    index: number,
    field: "name" | "price",
    value: string
  ) {
    setVariants((current) =>
      current.map((variant, i) =>
        i === index
          ? {
            ...variant,
            [field]: value,
          }
          : variant
      )
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      if (!name.trim()) {
        throw new Error("Food name is required.");
      }

      if (!categoryId) {
        throw new Error("Please select a category.");
      }

      if (!price || Number(price) < 0) {
        throw new Error("Please enter a valid price.");
      }

      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        categoryId,
        foodType,
        price: Number(price),
        image: image.trim() || null,
        isAvailable,
        isBestSeller,
        isRecommended,
        displayOrder: Number(displayOrder) || 0,
      };

      const response = await fetch(
        editing
          ? `/api/admin/menu/${item!.id}`
          : "/api/admin/menu",
        {
          method: editing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save menu item."
        );
      }

      /*
       * Variants are handled separately.
       * We will connect the variant API in the next step.
       */

      onSaved();
      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4 bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[28px] bg-white sm:rounded-[28px] bg-white sm:rounded-[28px]">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-[#073F35]">
              {editing ? "Edit Menu Item" : "Add Menu Item"}
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Manage the item shown on the Flutes menu.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">

          {/* Basic information */}
          <section>
            <h3 className="mb-3 font-bold">
              Basic Information
            </h3>

            <div className="space-y-4">

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Food Name *
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tandoori Chicken"
                  className="h-12 w-full rounded-xl border border-black/10 px-4 outline-none focus:border-[#073F35]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  rows={3}
                  placeholder="Short description..."
                  className="w-full resize-none rounded-xl border border-black/10 p-4 outline-none focus:border-[#073F35]"
                />
              </div>

            </div>
          </section>

          {/* Category + Food Type */}
          <section>
            <h3 className="mb-3 font-bold">
              Classification
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category *
                </label>

                <select
                  value={categoryId}
                  onChange={(e) =>
                    setCategoryId(e.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 outline-none"
                >
                  <option value="">
                    Select Category
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
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Food Type *
                </label>

                <div className="flex h-12 gap-2">
                  <button
                    type="button"
                    onClick={() => setFoodType("VEG")}
                    className={`flex-1 rounded-xl border text-sm font-bold ${foodType === "VEG"
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-black/10"
                      }`}
                  >
                    🟢 Veg
                  </button>

                  <button
                    type="button"
                    onClick={() => setFoodType("NON_VEG")}
                    className={`flex-1 rounded-xl border text-sm font-bold ${foodType === "NON_VEG"
                      ? "border-red-600 bg-red-50 text-red-700"
                      : "border-black/10"
                      }`}
                  >
                    🔴 Non-Veg
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* Price */}
          <section>
            <h3 className="mb-3 font-bold">
              Pricing
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Base Price *
                </label>

                <div className="flex h-12 items-center rounded-xl border border-black/10 px-4">
                  <span className="mr-2 text-gray-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                    className="w-full outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Display Order
                </label>

                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) =>
                    setDisplayOrder(e.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-black/10 px-4 outline-none"
                />
              </div>

            </div>
          </section>

          {/* Variants */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold">
                  Variants
                </h3>

                <p className="text-xs text-gray-500">
                  Example: Half / Full
                </p>
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-1 rounded-lg bg-[#073F35] px-3 py-2 text-xs font-bold text-white"
              >
                <Plus size={14} />
                Add Variant
              </button>
            </div>

            <div className="space-y-2">
              {variants.map((variant, index) => (
                <div
                  key={variant.id ?? index}
                  className="flex gap-2"
                >
                  <input
                    value={variant.name}
                    onChange={(e) =>
                      updateVariant(
                        index,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="Variant name"
                    className="h-11 flex-1 rounded-xl border border-black/10 px-3 outline-none"
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={variant.price}
                    onChange={(e) =>
                      updateVariant(
                        index,
                        "price",
                        e.target.value
                      )
                    }
                    placeholder="Price"
                    className="h-11 w-28 rounded-xl border border-black/10 px-3 outline-none"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeVariant(index)
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Image */}
          <section>
            <h3 className="mb-3 font-bold">
              Food Photo
            </h3>

            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Image URL"
              className="h-12 w-full rounded-xl border border-black/10 px-4 outline-none"
            />

            <p className="mt-2 text-xs text-gray-500">
              Persistent image upload/storage will be connected next.
            </p>
          </section>

          {/* Flags */}
          <section>
            <h3 className="mb-3 font-bold">
              Visibility & Highlights
            </h3>

            <div className="space-y-3">

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-black/5 p-4">
                <div>
                  <p className="font-semibold">
                    Available
                  </p>

                  <p className="text-xs text-gray-500">
                    Customers can order this item
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) =>
                    setIsAvailable(e.target.checked)
                  }
                  className="h-5 w-5"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-black/5 p-4">
                <div>
                  <p className="font-semibold">
                    Best Seller
                  </p>

                  <p className="text-xs text-gray-500">
                    Show in Best Sellers
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(e) =>
                    setIsBestSeller(e.target.checked)
                  }
                  className="h-5 w-5"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-black/5 p-4">
                <div>
                  <p className="font-semibold">
                    Recommended
                  </p>

                  <p className="text-xs text-gray-500">
                    Can appear in recommendations
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={isRecommended}
                  onChange={(e) =>
                    setIsRecommended(e.target.checked)
                  }
                  className="h-5 w-5"
                />
              </label>

            </div>
          </section>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <div className="flex gap-3 border-t border-black/5 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-black/10 py-3 font-bold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-[#073F35] py-3 font-bold text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editing
                  ? "Save Changes"
                  : "Add Item"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}