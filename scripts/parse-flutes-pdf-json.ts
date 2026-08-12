import fs from "fs";
import path from "path";

type TextNode = {
  type?: string;
  text?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fontSize?: number;
};

type Page = {
  children?: TextNode[];
};

type PdfData = {
  pages: Page[];
};

type FoodType = "VEG" | "NON_VEG";

type Variant = {
  name: string;
  price: number;
  foodType: FoodType;
};

type MenuItem = {
  name: string;
  description?: string;
  price: number;
  foodType: FoodType;
  variants?: Variant[];
};

type Category = {
  name: string;
  displayOrder: number;
  items: MenuItem[];
};

const INPUT = path.join(
  process.cwd(),
  "data",
  "pdf-menu.json"
);

const OUTPUT = path.join(
  process.cwd(),
  "data",
  "flutes-menu.json"
);

/* =========================================================
   EXCLUDED BAR / ALCOHOL CATEGORIES
========================================================= */

const EXCLUDED_CATEGORIES = new Set([
  "cocktails",
  "cocktail",
  "beer",
  "beers",
  "whisky",
  "whiskey",
  "vodka",
  "rum",
  "gin",
  "brandy",
  "wine",
  "wines",
]);

/* =========================================================
   CATEGORY NORMALIZATION
========================================================= */

function normalizeCategoryName(
  value: string
): string {
  const text = cleanText(value)
    .replace(/\s+/g, " ")
    .trim();

  const key = text
    .replace(/\s+/g, "")
    .toLowerCase();

  const map: Record<string, string> = {
    "stillspiritedalcoholfree":
      "Still Spirited Alcohol Free",

    "soupveg/non-veg":
      "Soup Veg/Non-Veg",

    "soupveg/nonveg":
      "Soup Veg/Non-Veg",

    "quickbites":
      "Quick Bites",

    "asianvegappetizer":
      "Asian Veg Appetizer",

    "asiannon-vegappetizer":
      "Asian Non-Veg Appetizer",

    "asiannonvegappetizer":
      "Asian Non-Veg Appetizer",

    "charcoalgrillveg":
      "Charcoal Grill Veg",

    "charcoalgrillnon-veg":
      "Charcoal Grill Non-Veg",

    "charcoalgrillnonveg":
      "Charcoal Grill Non-Veg",

    "sea-foodspecial":
      "Sea-Food Special",

    "seafoodspecial":
      "Sea-Food Special",

    "minipizza/pasta":
      "Mini Pizza /Pasta",

    "indianvegmaincourse":
      "Indian Veg Main Course",

    "indiannon-vegmaincourse":
      "Indian Non-Veg Main Course",

    "indiannonvegmaincourse":
      "Indian Non-Veg Main Course",

    "assortedbreads":
      "Assorted Breads",

    "asianmaincourse":
      "Asian Main Course",

    "sizzlers":
      "Sizzlers",

    "thai":
      "Thai",

    "biryani":
      "Biryani",

    "rice,dal&raita":
      "Rice, Dal & Raita",

    "rice,dalraita":
      "Rice, Dal & Raita",

    "desserts":
      "Desserts",

    "sandwiches":
      "Sandwiches",

    "shakessmoothies":
      "Shakes/Smoothies",

    "shakes/smoothies":
      "Shakes/Smoothies",

    "beverages":
      "Beverages",

    "cocktails":
      "Cocktails",
  };

  return map[key] ?? text;
}

/* =========================================================
   TEXT CLEANING
========================================================= */

function cleanText(
  value: string
): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;/gi, " ")
    .replace(/\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* =========================================================
   ITEM NAME CLEANING
========================================================= */

function normalizeItemName(
  value: string
): string {
  return cleanText(value)
    .replace(/\s+/g, " ")
    .replace(
      /^M\s+ini\b/i,
      "Mini"
    )
    .replace(
      /^M\s+ain\b/i,
      "Main"
    )
    .replace(
      /^M\s+urg\b/i,
      "Murg"
    )
    .replace(
      /^P\s+anner\b/i,
      "Panner"
    )
    .trim();
}

/* =========================================================
   PRICE DETECTION
========================================================= */

function isPrice(
  value: string
): boolean {
  return /^\d{2,4}(?:\/\d{2,4})*$/.test(
    cleanText(value)
  );
}

function parsePrices(
  value: string
): number[] {
  return cleanText(value)
    .split("/")
    .map((v) => Number(v.trim()))
    .filter((v) => Number.isFinite(v));
}

/* =========================================================
   FOOTER / DESCRIPTION FILTER
========================================================= */

function isFooter(
  value: string
): boolean {
  const text = cleanText(value)
    .toLowerCase();

  return (
    text.includes("government taxes") ||
    text.includes("governmenttaxes") ||
    text.includes("service charge") ||
    text.includes("servicecharge")
  );
}

function isDescription(
  node: TextNode
): boolean {
  const text = cleanText(
    node.text ?? ""
  );

  if (!text) {
    return true;
  }

  /*
   * PDF descriptions generally use
   * a much smaller font.
   */
  return (
    (node.fontSize ?? 0) < 18
  );
}

/* =========================================================
   CATEGORY HEADING
========================================================= */

function isCategoryHeading(
  node: TextNode
): boolean {
  if (!node.text) {
    return false;
  }

  const text = cleanText(
    node.text
  );

  if (!text) {
    return false;
  }

  /*
   * Category headings in the actual
   * PDF are large-font text nodes.
   */
  return (
    (node.fontSize ?? 0) >= 50
  );
}

/* =========================================================
   FOOD TYPE
========================================================= */

function getFoodType(
  name: string,
  category: string
): FoodType {
  const text =
    `${category} ${name}`.toLowerCase();

  if (
    text.includes("non-veg") ||
    text.includes("non veg") ||
    text.includes("chicken") ||
    text.includes("murg") ||
    text.includes("mutton") ||
    text.includes("ghost") ||
    text.includes("prawn") ||
    text.includes("prawns") ||
    text.includes("fish") ||
    text.includes("surmai") ||
    text.includes("pomfret") ||
    text.includes("pomfrat") ||
    text.includes("seafood")
  ) {
    return "NON_VEG";
  }

  return "VEG";
}

function getVariantFoodType(
  variant: string
): FoodType {
  const text =
    variant.toLowerCase();

  if (
    text.includes("chicken") ||
    text.includes("mutton") ||
    text.includes("prawn") ||
    text.includes("seafood") ||
    text.includes("fish") ||
    text.includes("non-veg")
  ) {
    return "NON_VEG";
  }

  return "VEG";
}

/* =========================================================
   KNOWN VARIANT NAMES
========================================================= */

function detectVariantNames(
  itemName: string,
  count: number
): string[] {
  const text =
    itemName
      .toLowerCase()
      .replace(/\s+/g, "");

  if (
    count === 2 &&
    (
      text.includes("half/full") ||
      text.includes("(half/full)")
    )
  ) {
    return ["Half", "Full"];
  }

  if (
    count === 2 &&
    text.includes("plain/butter")
  ) {
    return ["Plain", "Butter"];
  }

  if (
    count === 2 &&
    (
      text.includes("veg/chicken") ||
      text.includes("veg-chicken")
    )
  ) {
    return ["Veg", "Chicken"];
  }

  if (
    count === 2 &&
    text.includes("garlic/cheesegarlic")
  ) {
    return [
      "Garlic",
      "Cheese Garlic",
    ];
  }

  if (
    count === 2 &&
    text.includes("fry/roasted")
  ) {
    return [
      "Fry",
      "Roasted",
    ];
  }

  if (
    count === 2 &&
    text.includes("salted/peri-peri")
  ) {
    return [
      "Salted",
      "Peri-Peri",
    ];
  }

  if (
    count === 2 &&
    text.includes("ghee/tadka")
  ) {
    return [
      "Ghee",
      "Tadka",
    ];
  }

  if (
    count === 2 &&
    text.includes("water/soda")
  ) {
    return [
      "Water",
      "Soda",
    ];
  }

  if (
    count === 2 &&
    text.includes("tea/coffee")
  ) {
    return [
      "Tea",
      "Coffee",
    ];
  }

  if (
    count === 2 &&
    text.includes(
      "coldcoffee/withice-cream"
    )
  ) {
    return [
      "Cold Coffee",
      "With Ice-Cream",
    ];
  }

  if (
    count === 2 &&
    text.includes(
      "tonicwater/energydrink"
    )
  ) {
    return [
      "Tonic Water",
      "Energy Drink",
    ];
  }

  if (
    count === 3 &&
    text.includes(
      "veg/chicken/seafood"
    )
  ) {
    return [
      "Veg",
      "Chicken",
      "Seafood",
    ];
  }

  if (
    count === 3 &&
    text.includes(
      "veg/boondi/pineapple"
    )
  ) {
    return [
      "Veg",
      "Boondi",
      "Pineapple",
    ];
  }

  if (
    count === 4 &&
    text.includes(
      "aloo/veg/paneer/keralam"
    )
  ) {
    return [
      "Aloo",
      "Veg",
      "Paneer",
      "Keralam",
    ];
  }

  if (
    count === 3 &&
    text.includes(
      "onion/veg/paneer"
    )
  ) {
    return [
      "Onion",
      "Veg",
      "Paneer",
    ];
  }

  /*
   * Generic safe fallback.
   */
  return Array.from(
    { length: count },
    (_, index) =>
      `Option ${index + 1}`
  );
}

/* =========================================================
   HEADER VARIANT DETECTION
========================================================= */

function extractHeaderLabels(
  nodes: TextNode[]
): string[] {
  const candidates: {
    x: number;
    labels: string[];
  }[] = [];

  for (const node of nodes) {
    if (!node.text) {
      continue;
    }

    const text =
      cleanText(node.text)
        .toUpperCase();

    if (
      !(
        text.includes("VEG") ||
        text.includes("CHICKEN") ||
        text.includes("PRAWNS") ||
        text.includes("SEAFOOD")
      )
    ) {
      continue;
    }

    if (
      (node.fontSize ?? 0) >= 25
    ) {
      continue;
    }

    const labels =
      text
        .replace(/-/g, " ")
        .split(/\s+/)
        .filter(Boolean)
        .filter((label) =>
          [
            "VEG",
            "CHICKEN",
            "PRAWNS",
            "SEAFOOD",
          ].includes(label)
        );

    if (labels.length > 0) {
      candidates.push({
        x: node.x ?? 0,
        labels,
      });
    }
  }

  /*
   * If labels are represented as separate
   * nodes, sort them by X.
   */

  const flattened =
    candidates.flatMap(
      (item) =>
        item.labels.map(
          (label, index) => ({
            label,
            x:
              item.x +
              index * 50,
          })
        )
    );

  return flattened
    .sort((a, b) => a.x - b.x)
    .map((item) => {
      if (item.label === "PRAWNS") {
        return "Prawns";
      }

      if (item.label === "SEAFOOD") {
        return "Seafood";
      }

      if (item.label === "CHICKEN") {
        return "Chicken";
      }

      return "Veg";
    });
}

/* =========================================================
   PRICE ROW GROUPING
========================================================= */

type PriceRow = {
  y: number;
  prices: {
    value: number;
    x: number;
  }[];
};

function buildPriceRows(
  nodes: TextNode[]
): PriceRow[] {
  const priceNodes =
    nodes.filter(
      (node) =>
        node.text &&
        isPrice(node.text)
    );

  const rows: PriceRow[] = [];

  for (const node of priceNodes) {
    const y =
      node.y ?? 0;

    const existing =
      rows.find(
        (row) =>
          Math.abs(row.y - y) <= 6
      );

    const parsed =
      parsePrices(
        node.text!
      );

    /*
     * A slash-separated price belongs
     * to the same item and stays one
     * price group.
     */

    if (existing) {
      for (const value of parsed) {
        existing.prices.push({
          value,
          x: node.x ?? 0,
        });
      }
    } else {
      rows.push({
        y,
        prices: parsed.map(
          (value) => ({
            value,
            x: node.x ?? 0,
          })
        ),
      });
    }
  }

  return rows.sort(
    (a, b) => a.y - b.y
  );
}

/* =========================================================
   BUILD ITEMS FOR ONE CATEGORY
========================================================= */

function parseCategory(
  categoryName: string,
  sectionNodes: TextNode[]
): MenuItem[] {
  const priceRows =
    buildPriceRows(
      sectionNodes
    );

  if (
    priceRows.length === 0
  ) {
    return [];
  }

  /*
   * Text nodes which are likely menu
   * item names.
   */

  const textNodes =
    sectionNodes
      .filter(
        (node) =>
          !!node.text
      )
      .filter(
        (node) =>
          !isPrice(
            node.text!
          )
      )
      .filter(
        (node) =>
          !isFooter(
            node.text!
          )
      )
      .filter(
        (node) =>
          !isDescription(node)
      )
      .filter(
        (node) =>
          (node.fontSize ?? 0) >= 20
      )
      .filter(
        (node) =>
          ![
            "VEG",
            "CHICKEN",
            "PRAWNS",
            "SEAFOOD",
          ].includes(
            cleanText(
              node.text!
            ).toUpperCase()
          )
      );

  const usedText =
    new Set<TextNode>();

  const items: MenuItem[] = [];

  /*
   * Header labels for multi-column
   * sections.
   */

  const sectionHeaders =
    extractHeaderLabels(
      sectionNodes
    );

  for (const row of priceRows) {
    /*
     * Find the actual item text on
     * this same visual row.
     */

    const sameRow =
      textNodes
        .filter(
          (node) =>
            Math.abs(
              (node.y ?? 0) -
                row.y
            ) <= 10
        )
        .sort(
          (a, b) =>
            (a.x ?? 0) -
            (b.x ?? 0)
        );

    if (
      sameRow.length === 0
    ) {
      continue;
    }

    let itemNode =
      sameRow.find(
        (node) =>
          (node.x ?? 0) <
          250
      );

    if (!itemNode) {
      itemNode =
        sameRow[0];
    }

    usedText.add(
      itemNode
    );

    let itemName =
      normalizeItemName(
        itemNode.text!
      );

    /*
     * Sometimes the PDF breaks a
     * single item into multiple lines.
     *
     * Example:
     *
     * RESHMI/KALIMIRI/BANJARA/
     * PAHADI/ANGARA/MALAI
     */

    const currentIndex =
      textNodes.indexOf(
        itemNode
      );

    for (
      let i =
        currentIndex + 1;
      i < textNodes.length;
      i++
    ) {
      const next =
        textNodes[i];

      if (
        usedText.has(next)
      ) {
        continue;
      }

      const nextY =
        next.y ?? 0;

      const currentY =
        itemNode.y ?? 0;

      /*
       * Stop when we reach the next
       * actual price row.
       */

      const nextPriceRow =
        priceRows.find(
          (candidate) =>
            candidate.y >
            currentY + 5
        );

      if (
        nextPriceRow &&
        nextY >=
          nextPriceRow.y - 10
      ) {
        break;
      }

      const gap =
        nextY - currentY;

      if (
        gap > 0 &&
        gap <= 90 &&
        Math.abs(
          (next.x ?? 0) -
            (itemNode.x ?? 0)
        ) <= 40
      ) {
        itemName +=
          ` ${cleanText(
            next.text!
          )}`;

        usedText.add(
          next
        );
      } else if (
        gap > 90
      ) {
        break;
      }
    }

    const prices =
      row.prices
        .sort(
          (a, b) =>
            a.x - b.x
        );

    const priceValues =
      prices.map(
        (p) => p.value
      );

    if (
      priceValues.length === 0
    ) {
      continue;
    }

    /*
     * Multiple price columns.
     */

    let variantNames: string[] =
      [];

    /*
     * First try section-level
     * column headers.
     */

    if (
      priceValues.length > 1 &&
      sectionHeaders.length ===
        priceValues.length
    ) {
      variantNames =
        sectionHeaders;
    }

    /*
     * Then use item-name based
     * variant detection.
     */

    if (
      variantNames.length !==
      priceValues.length
    ) {
      variantNames =
        detectVariantNames(
          itemName,
          priceValues.length
        );
    }

    const foodType =
      getFoodType(
        itemName,
        categoryName
      );

    /*
     * One normal price.
     */

    if (
      priceValues.length === 1
    ) {
      items.push({
        name: itemName,
        price:
          priceValues[0],
        foodType,
      });

      continue;
    }

    /*
     * Multiple prices → variants.
     *
     * Base price is first variant price
     * because Prisma requires MenuItem.price.
     */

    const variants: Variant[] =
      priceValues.map(
        (price, index) => {
          const name =
            variantNames[index] ??
            `Option ${index + 1}`;

          return {
            name,
            price,
            foodType:
              getVariantFoodType(
                name
              ),
          };
        }
      );

    items.push({
      name: itemName,
      price:
        priceValues[0],
      foodType,
      variants,
    });
  }

  /*
   * Remove duplicates.
   */

  const unique =
    new Map<
      string,
      MenuItem
    >();

  for (const item of items) {
    const key =
      item.name
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

    if (
      !unique.has(key)
    ) {
      unique.set(
        key,
        item
      );
    }
  }

  return Array.from(
    unique.values()
  );
}

/* =========================================================
   PARSE ONE PAGE
========================================================= */

function parsePage(
  page: Page
): Category[] {
  const nodes =
    (page.children ?? [])
      .filter(
        (node) =>
          node.type === "text" &&
          !!node.text
      )
      .sort(
        (a, b) =>
          (a.y ?? 0) -
            (b.y ?? 0) ||
          (a.x ?? 0) -
            (b.x ?? 0)
      );

  const headings =
    nodes
      .filter(
        isCategoryHeading
      )
      .sort(
        (a, b) =>
          (a.y ?? 0) -
          (b.y ?? 0)
      );

  const result: Category[] =
    [];

  for (
    let index = 0;
    index < headings.length;
    index++
  ) {
    const heading =
      headings[index];

    const rawName =
      cleanText(
        heading.text!
      );

    const categoryName =
      normalizeCategoryName(
        rawName
      );

    /*
     * Never import Cocktails.
     */

    if (
      EXCLUDED_CATEGORIES.has(
        categoryName
          .toLowerCase()
          .trim()
      )
    ) {
      continue;
    }

    const startY =
      heading.y ?? 0;

    const nextHeading =
      headings[index + 1];

    const endY =
      nextHeading
        ? nextHeading.y ??
          Infinity
        : Infinity;

    const sectionNodes =
      nodes.filter(
        (node) => {
          const y =
            node.y ?? 0;

          return (
            y > startY &&
            y < endY
          );
        }
      );

    const items =
      parseCategory(
        categoryName,
        sectionNodes
      );

    if (
      items.length > 0
    ) {
      result.push({
        name: categoryName,
        displayOrder:
          index + 1,
        items,
      });
    }
  }

  return result;
}

/* =========================================================
   MAIN
========================================================= */

function main() {
  console.log(
    "# 🍽️ FLUTES MENU PARSER V4\n"
  );

  if (
    !fs.existsSync(INPUT)
  ) {
    throw new Error(
      `Menu JSON not found:\n${INPUT}`
    );
  }

  const raw =
    fs.readFileSync(
      INPUT,
      "utf8"
    );

  const data: PdfData =
    JSON.parse(raw);

  if (
    !Array.isArray(
      data.pages
    )
  ) {
    throw new Error(
      "Invalid PDF JSON: pages[] missing."
    );
  }

  /*
   * Actual food menu is pages 3–17.
   *
   * Page 17 contains Beverages and
   * a separate Cocktails section.
   * Cocktails are filtered above.
   */

  const pages =
    data.pages.slice(
      2,
      17
    );

  const categories: Category[] =
    [];

  for (const page of pages) {
    const parsed =
      parsePage(page);

    categories.push(
      ...parsed
    );
  }

  /*
   * Merge duplicate categories
   * appearing because of PDF layout.
   */

  const categoryMap =
    new Map<
      string,
      Category
    >();

  for (const category of categories) {
    const key =
      category.name
        .replace(/\s+/g, "")
        .toLowerCase();

    const existing =
      categoryMap.get(key);

    if (!existing) {
      categoryMap.set(
        key,
        {
          ...category,
          items: [
            ...category.items,
          ],
        }
      );

      continue;
    }

    for (
      const item of category.items
    ) {
      const exists =
        existing.items.some(
          (oldItem) =>
            oldItem.name
              .toLowerCase()
              .replace(/\s+/g, " ")
              .trim() ===
            item.name
              .toLowerCase()
              .replace(/\s+/g, " ")
              .trim()
        );

      if (!exists) {
        existing.items.push(
          item
        );
      }
    }
  }

  const finalCategories =
    Array.from(
      categoryMap.values()
    ).map(
      (category, index) => ({
        ...category,
        displayOrder:
          index + 1,
      })
    );

  /*
   * Final JSON
   */

  const output = {
    source:
      "Final Menu Card flutes.pdf",

    generatedAt:
      new Date().toISOString(),

    categories:
      finalCategories,
  };

  fs.writeFileSync(
    OUTPUT,
    JSON.stringify(
      output,
      null,
      2
    ),
    "utf8"
  );

  const itemCount =
    finalCategories.reduce(
      (total, category) =>
        total +
        category.items.length,
      0
    );

  const variantCount =
    finalCategories.reduce(
      (total, category) =>
        total +
        category.items.reduce(
          (itemTotal, item) =>
            itemTotal +
            (
              item.variants
                ?.length ?? 0
            ),
          0
        ),
      0
    );

  console.log(
    `Categories: ${finalCategories.length}`
  );

  console.log(
    `Items: ${itemCount}`
  );

  console.log(
    `Variants: ${variantCount}`
  );

  console.log(
    `\n✅ Created: ${OUTPUT}\n`
  );

  console.log(
    "Categories:\n"
  );

  for (
    const category of finalCategories
  ) {
    console.log(
      `${category.displayOrder}. ${category.name} (${category.items.length})`
    );
  }
}

main();