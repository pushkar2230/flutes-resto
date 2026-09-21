"use client";

import {
    Check,
    ChevronRight,
    Heart,
    Leaf,
    Minus,
    Plus,
    ShieldCheck,
    ShoppingCart,
    X,
} from "lucide-react";

type Variant = {
    id: string;
    name: string;
    price: number;
    isAvailable?: boolean;
};

type VariantSheetProps = {
    open: boolean;
    itemName: string;
    itemDescription?: string | null;
    foodType?: string;
    variants: Variant[];
    selectedVariantId: string | null;
    onSelectVariant: (variantId: string) => void;
    onClose: () => void;
    onAddToCart: (variant: Variant) => void;
};

export default function VariantSheet({
    open,
    itemName,
    itemDescription,
    foodType,
    variants,
    selectedVariantId,
    onSelectVariant,
    onClose,
    onAddToCart,
}: VariantSheetProps) {
    if (!open) return null;

    const availableVariants = variants.filter(
        (variant) => variant.isAvailable !== false
    );

    const selectedVariant =
        availableVariants.find(
            (variant) => variant.id === selectedVariantId
        ) ?? availableVariants[0];

    if (!selectedVariant) return null;

    const isVeg = foodType === "VEG";

    return (
        <div className="fixed inset-0 z-[100]">
            {/* BACKDROP */}
            <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute inset-0 bg-black/45 backdrop-blur-[5px]"
            />

            {/* SHEET */}
            <div
                className="
          absolute
          bottom-0
          left-1/2
          w-full
          max-w-[480px]
          -translate-x-1/2
          overflow-hidden
          rounded-t-[32px]
          bg-[#FAFBF9]
          shadow-[0_-20px_60px_rgba(0,0,0,0.25)]
        "
            >
                {/* DRAG HANDLE */}
                <div className="flex justify-center pt-3">
                    <div className="h-1.5 w-14 rounded-full bg-[#D5D9D6]" />
                </div>

                <div className="max-h-[88vh] overflow-y-auto px-5 pb-6 pt-4">

                    {/* ================= HEADER ================= */}
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
                ${isVeg
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
                  rounded-full
                  border-2
                  ${isVeg
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
                    ${isVeg
                                            ? "bg-[#247A43]"
                                            : "bg-[#B3262E]"
                                        }
                  `}
                                />
                            </span>
                        </div>

                        {/* TITLE */}
                        <div className="min-w-0 flex-1">
                            <h2 className="text-[20px] font-bold leading-[1.15] tracking-[-0.035em] text-[#171A19]">
                                {itemName}
                            </h2>

                            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8A918D]">
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
                transition-transform
                active:scale-90
              "
                        >
                            <X size={20} strokeWidth={1.8} />
                        </button>
                    </div>

                    {/* ================= DESCRIPTION ================= */}
                    {itemDescription && (
                        <p className="mt-5 text-[13px] leading-5 text-[#707773]">
                            {itemDescription}
                        </p>
                    )}

                    {/* ================= OPTION TITLE ================= */}
                    <div className="mt-6">
                        <p className="text-[14px] font-semibold text-[#103F35]">
                            Choose your preferred option
                        </p>
                    </div>

                    {/* ================= VARIANTS ================= */}
                    <div className="mt-3 space-y-3">
                        {availableVariants.map((variant) => {
                            const selected = variant.id === selectedVariant.id;

                            return (
                                <button
                                    key={variant.id}
                                    type="button"
                                    onClick={() => onSelectVariant(variant.id)}
                                    className={`
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-[19px]
                    border
                    px-4
                    py-4
                    text-left
                    transition-all
                    duration-150
                    active:scale-[0.985]
                    ${selected
                                            ? "border-[#103F35] bg-[#EDF7F3] shadow-[0_6px_20px_rgba(16,63,53,0.08)]"
                                            : "border-[#E1E5E2] bg-white"
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
                                            <span className="h-3.5 w-3.5 rounded-full bg-[#0D6757]" />
                                        )}
                                    </span>

                                    {/* VARIANT NAME */}
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
                                            <div className="mt-1 flex items-center gap-1 text-[9px] font-medium text-[#7B8580]">
                                                <Check size={10} strokeWidth={2.5} />
                                                Selected option
                                            </div>
                                        )}
                                    </div>

                                    {/* PRICE */}
                                    <div className="text-right">
                                        <p className="text-[17px] font-bold tracking-[-0.02em] text-[#171A19]">
                                            ₹{variant.price}
                                        </p>

                                        {selected && (
                                            <span className="mt-1 inline-flex rounded-full bg-[#DDEFE8] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-[#0D6757]">
                                                Selected
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* ================= QUANTITY ================= */}
                    <div className="mt-5 flex items-center justify-between">

                        <div>
                            <p className="text-[12px] font-semibold text-[#303633]">
                                Quantity
                            </p>

                            <p className="mt-0.5 text-[9px] text-[#8A918D]">
                                Add one to your order
                            </p>
                        </div>

                        <div
                            className="
                flex
                h-10
                items-center
                rounded-full
                border
                border-[#DCE1DD]
                bg-white
                p-1
                shadow-[0_4px_14px_rgba(16,63,53,0.05)]
              "
                        >
                            <button
                                type="button"
                                disabled
                                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F0F2EF]
                  text-[#B1B7B3]
                "
                            >
                                <Minus size={14} />
                            </button>

                            <span className="w-9 text-center text-[14px] font-bold text-[#103F35]">
                                1
                            </span>

                            <button
                                type="button"
                                disabled
                                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-[#103F35]
                  text-white
                "
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>

                    {/* ================= ADD TO CART ================= */}
                    <button
                        type="button"
                        onClick={() => onAddToCart(selectedVariant)}
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
              active:scale-[0.985]
              active:shadow-[0_5px_15px_rgba(16,63,53,0.18)]
            "
                    >
                        <div
                            className="
                flex
                h-9
                w-9
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

                        <span className="ml-3 text-[15px] font-semibold">
                            Add to Cart
                        </span>

                        <span className="ml-auto mr-3 h-6 w-px bg-white/20" />

                        <span className="text-[16px] font-bold">
                            ₹{selectedVariant.price}
                        </span>

                        <ChevronRight
                            size={19}
                            className="ml-2 text-white/70"
                        />
                    </button>

                    {/* ================= FEATURE CHIPS ================= */}
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
                        <FeatureChip
                            icon={<Leaf size={14} strokeWidth={1.8} />}
                            text="Freshly Made"
                        />

                        <FeatureChip
                            icon={<ShieldCheck size={14} strokeWidth={1.8} />}
                            text="Hygienically Prepared"
                        />

                        <FeatureChip
                            icon={<Heart size={14} strokeWidth={1.8} />}
                            text="Loved by Many"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   FEATURE CHIP
========================================================= */

function FeatureChip({
    icon,
    text,
}: {
    icon: React.ReactNode;
    text: string;
}) {
    return (
        <div
            className="
        flex
        shrink-0
        items-center
        gap-1.5
        rounded-full
        border
        border-[#E6E9E6]
        bg-white
        px-3
        py-2
        text-[9px]
        font-medium
        text-[#59615C]
        shadow-[0_3px_10px_rgba(16,63,53,0.035)]
      "
        >
            <span className="text-[#0D6757]">
                {icon}
            </span>

            {text}
        </div>
    );
}