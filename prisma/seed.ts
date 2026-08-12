import {
  PrismaClient,
  FoodType,
} from "@prisma/client";

const prisma = new PrismaClient();

type MenuItemSeed = {
  name: string;
  price?: number;
  foodType: FoodType;
  description?: string;
  variants?: {
    name: string;
    price: number;
    foodType?: FoodType;
  }[];
};

type CategorySeed = {
  name: string;
  items: MenuItemSeed[];
};

const menu: CategorySeed[] = [
  {
    name: "Soup Veg/Non-Veg",
    items: [
      {
        name: "Manchow Soup",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 249, foodType: FoodType.VEG },
          { name: "Chicken", price: 269, foodType: FoodType.NON_VEG },
          { name: "Prawns", price: 299, foodType: FoodType.NON_VEG },
        ],
      },
      {
        name: "Hot & Sour",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 249, foodType: FoodType.VEG },
          { name: "Chicken", price: 269, foodType: FoodType.NON_VEG },
          { name: "Prawns", price: 299, foodType: FoodType.NON_VEG },
        ],
      },
      {
        name: "Sweetcorn",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 249, foodType: FoodType.VEG },
          { name: "Chicken", price: 269, foodType: FoodType.NON_VEG },
          { name: "Prawns", price: 299, foodType: FoodType.NON_VEG },
        ],
      },
      {
        name: "Clear Soup",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 249, foodType: FoodType.VEG },
          { name: "Chicken", price: 269, foodType: FoodType.NON_VEG },
          { name: "Prawns", price: 299, foodType: FoodType.NON_VEG },
        ],
      },
      {
        name: "Cream Of",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 269, foodType: FoodType.VEG },
          { name: "Chicken", price: 289, foodType: FoodType.NON_VEG },
          { name: "Prawns", price: 299, foodType: FoodType.NON_VEG },
        ],
      },
      {
        name: "Shorba",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 249, foodType: FoodType.VEG },
          { name: "Chicken", price: 269, foodType: FoodType.NON_VEG },
          { name: "Prawns", price: 299, foodType: FoodType.NON_VEG },
        ],
      },
      {
        name: "Wanton",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 249, foodType: FoodType.VEG },
          { name: "Chicken", price: 269, foodType: FoodType.NON_VEG },
          { name: "Prawns", price: 299, foodType: FoodType.NON_VEG },
        ],
      },
      {
        name: "Tom Yum",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 249, foodType: FoodType.VEG },
          { name: "Chicken", price: 269, foodType: FoodType.NON_VEG },
          { name: "Prawns", price: 299, foodType: FoodType.NON_VEG },
        ],
      },
      {
        name: "Thai Spice",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 269, foodType: FoodType.VEG },
          { name: "Chicken", price: 289, foodType: FoodType.NON_VEG },
          { name: "Prawns", price: 299, foodType: FoodType.NON_VEG },
        ],
      },
      {
        name: "Rosted Almond Broccoli Soup",
        price: 299,
        foodType: FoodType.VEG,
      },
      {
        name: "Tomkha",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 269, foodType: FoodType.VEG },
          { name: "Chicken", price: 289, foodType: FoodType.NON_VEG },
          { name: "Prawns", price: 299, foodType: FoodType.NON_VEG },
        ],
      },
      {
        name: "Lung Fung",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 249, foodType: FoodType.VEG },
          { name: "Chicken", price: 269, foodType: FoodType.NON_VEG },
          { name: "Prawns", price: 299, foodType: FoodType.NON_VEG },
        ],
      },
    ],
  },
  {
    name: "Sea-Food Special",
    items: [
      {
        name: "Surmai - Rawa/Tawa",
        price: 679,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Pomfrat - Rawa/Tawa",
        price: 699,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Prawns - Rawa/Tawa/Koliwada/Kurkure",
        price: 649,
        foodType: FoodType.NON_VEG,
      },
    ],
  },
  {
    name: "Mini Pizza /Pasta",
    items: [
      {
        name: "Margherita Pizza",
        price: 249,
        foodType: FoodType.VEG,
      },
      {
        name: "Paneer Tikka Pizza",
        price: 299,
        foodType: FoodType.VEG,
      },
      {
        name: "Exotic Vegetable Pizza",
        price: 249,
        foodType: FoodType.VEG,
      },
      {
        name: "BBQ Chicken Pizza",
        price: 309,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Chicken Tikka Pizza",
        price: 309,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Chicken Kheema Pizza",
        price: 349,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Alfrdo Chesse (Veg - Chicken)",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 529, foodType: FoodType.VEG },
          { name: "Chicken", price: 559, foodType: FoodType.NON_VEG },
        ],
      },
      {
        name: "Arabita Sauce (Veg - Chicken)",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 529, foodType: FoodType.VEG },
          { name: "Chicken", price: 559, foodType: FoodType.NON_VEG },
        ],
      },
      {
        name: "Pink Lady (Veg - Chicken)",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 529, foodType: FoodType.VEG },
          { name: "Chicken", price: 559, foodType: FoodType.NON_VEG },
        ],
      },
      {
        name: "Pesto (Veg - Chicken)",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 529, foodType: FoodType.VEG },
          { name: "Chicken", price: 559, foodType: FoodType.NON_VEG },
        ],
      },
    ],
  },
  {
    name: "Asian Main Course",
    items: [
      {
        name: "The Best Combination Rice",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 409, foodType: FoodType.VEG },
          { name: "Chicken", price: 469, foodType: FoodType.NON_VEG },
          { name: "Prawns", price: 509, foodType: FoodType.NON_VEG },
        ],
      },
      {
        name: "Wok Fried Rice",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 329, foodType: FoodType.VEG },
          { name: "Chicken", price: 349, foodType: FoodType.NON_VEG },
          { name: "Prawns", price: 389, foodType: FoodType.NON_VEG },
        ],
      },
      {
        name: "Wok Burnt Garlic Fried Rice",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 349, foodType: FoodType.VEG },
          { name: "Chicken", price: 389, foodType: FoodType.NON_VEG },
          { name: "Prawns", price: 399, foodType: FoodType.NON_VEG },
        ],
      },
      {
        name: "Wok Sichuan Fried Rice",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 409, foodType: FoodType.VEG },
          { name: "Chicken", price: 469, foodType: FoodType.NON_VEG },
          { name: "Prawns", price: 509, foodType: FoodType.NON_VEG },
        ],
      },
      {
        name: "Kung Pow Noodles",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 329, foodType: FoodType.VEG },
          { name: "Chicken", price: 349, foodType: FoodType.NON_VEG },
          { name: "Prawns", price: 389, foodType: FoodType.NON_VEG },
        ],
      },
      {
        name: "Singapuri Noodles",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 349, foodType: FoodType.VEG },
          { name: "Chicken", price: 369, foodType: FoodType.NON_VEG },
          { name: "Prawns", price: 399, foodType: FoodType.NON_VEG },
        ],
      },
      {
        name: "Burnt Galic Noodles",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 329, foodType: FoodType.VEG },
          { name: "Chicken", price: 349, foodType: FoodType.NON_VEG },
          { name: "Prawns", price: 389, foodType: FoodType.NON_VEG },
        ],
      },
      {
        name: "Chilli Garlic Noodles",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 329, foodType: FoodType.VEG },
          { name: "Chicken", price: 349, foodType: FoodType.NON_VEG },
          { name: "Prawns", price: 389, foodType: FoodType.NON_VEG },
        ],
      },
      {
        name: "Hakka Noodles",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 309, foodType: FoodType.VEG },
          { name: "Chicken", price: 329, foodType: FoodType.NON_VEG },
          { name: "Prawns", price: 369, foodType: FoodType.NON_VEG },
        ],
      },
      {
        name: "Combo Rice",
        foodType: FoodType.VEG,
        variants: [
          { name: "Veg", price: 409, foodType: FoodType.VEG },
          { name: "Chicken", price: 469, foodType: FoodType.NON_VEG },
          { name: "Prawns", price: 509, foodType: FoodType.NON_VEG },
        ],
      },
    ],
  },
  {
    name: "Quick Bites",
    items: [
      {
        name: "French Fry (Salted/Peri-Peri)",
        price: 239,
        foodType: FoodType.VEG,
      },
      {
        name: "Chicken Pop-Corn",
        price: 459,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Cheese Garlic Bread",
        price: 369,
        foodType: FoodType.VEG,
      },
      {
        name: "Masala Papad (Fry/Roasted)",
        price: 99,
        foodType: FoodType.VEG,
      },
      {
        name: "Cheese Cherry Pineapple",
        price: 259,
        foodType: FoodType.VEG,
      },
      {
        name: "Masala Peanuts",
        price: 189,
        foodType: FoodType.VEG,
      },
      {
        name: "Chana Garlic Fry",
        price: 299,
        foodType: FoodType.VEG,
      },
      {
        name: "Green Peas Fry",
        price: 199,
        foodType: FoodType.VEG,
      },
      {
        name: "Karari Roti",
        price: 279,
        foodType: FoodType.VEG,
      },
      {
        name: "Boiled Egg",
        price: 89,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Garden Salad",
        price: 199,
        foodType: FoodType.VEG,
      },
      {
        name: "Cesar Salad",
        foodType: FoodType.VEG,
        variants: [
          {
            name: "Veg",
            price: 329,
            foodType: FoodType.VEG,
          },
          {
            name: "Chicken",
            price: 349,
            foodType: FoodType.NON_VEG,
          },
        ],
      },
      {
        name: "Chana Koliwada",
        price: 299,
        foodType: FoodType.VEG,
      },
    ],
  },
  {
    name: "Indian Veg Main Course",
    items: [
      {
        name: "Paneer Tikka Masala",
        price: 449,
        foodType: FoodType.VEG,
      },
      {
        name: "Paneer Kadhai",
        price: 449,
        foodType: FoodType.VEG,
      },
      {
        name: "Paneer Peshawari",
        price: 449,
        foodType: FoodType.VEG,
      },
      {
        name: "Paneer Lababdar",
        price: 449,
        foodType: FoodType.VEG,
      },
      {
        name: "Paneer Kolhapuri",
        price: 449,
        foodType: FoodType.VEG,
      },
      {
        name: "Paneer Makhanwala",
        price: 449,
        foodType: FoodType.VEG,
      },
      {
        name: "Paneer Handi",
        price: 449,
        foodType: FoodType.VEG,
      },
      {
        name: "Veg Handi",
        price: 429,
        foodType: FoodType.VEG,
      },
      {
        name: "Veg Kolhapuri",
        price: 429,
        foodType: FoodType.VEG,
      },
      {
        name: "Veg Kadhai",
        price: 429,
        foodType: FoodType.VEG,
      },
      {
        name: "Veg Peshawari",
        price: 429,
        foodType: FoodType.VEG,
      },
      {
        name: "Veg Makhanwala",
        price: 429,
        foodType: FoodType.VEG,
      },
      {
        name: "Dal Tadka",
        price: 329,
        foodType: FoodType.VEG,
      },
      {
        name: "Dal Fry",
        price: 329,
        foodType: FoodType.VEG,
      },
      {
        name: "Dal Makhani",
        price: 369,
        foodType: FoodType.VEG,
      },
    ],
  },

  {
    name: "Indian Non-Veg Main Course",
    items: [
      {
        name: "Chicken Tikka Masala",
        price: 489,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Chicken Kadhai",
        price: 489,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Chicken Peshawari",
        price: 489,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Chicken Lababdar",
        price: 489,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Chicken Kolhapuri",
        price: 489,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Chicken Makhanwala",
        price: 489,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Chicken Handi",
        foodType: FoodType.NON_VEG,
        variants: [
          {
            name: "Half",
            price: 449,
            foodType: FoodType.NON_VEG,
          },
          {
            name: "Full",
            price: 749,
            foodType: FoodType.NON_VEG,
          },
        ],
      },
      {
        name: "Murg Mussallam",
        price: 799,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Mutton Handi",
        foodType: FoodType.NON_VEG,
        variants: [
          {
            name: "Half",
            price: 549,
            foodType: FoodType.NON_VEG,
          },
          {
            name: "Full",
            price: 999,
            foodType: FoodType.NON_VEG,
          },
        ],
      },
      {
        name: "Mutton Rogan Josh",
        price: 599,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Mutton Rara",
        price: 599,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Mutton Kolhapuri",
        price: 599,
        foodType: FoodType.NON_VEG,
      },
    ],
  },

  {
    name: "Assorted Breads",
    items: [
      {
        name: "Tandoori Roti",
        foodType: FoodType.VEG,
        variants: [
          {
            name: "Plain",
            price: 49,
            foodType: FoodType.VEG,
          },
          {
            name: "Butter",
            price: 59,
            foodType: FoodType.VEG,
          },
        ],
      },
      {
        name: "Naan",
        foodType: FoodType.VEG,
        variants: [
          {
            name: "Plain",
            price: 79,
            foodType: FoodType.VEG,
          },
          {
            name: "Butter",
            price: 89,
            foodType: FoodType.VEG,
          },
        ],
      },
      {
        name: "Garlic Naan",
        price: 119,
        foodType: FoodType.VEG,
      },
      {
        name: "Cheese Garlic Naan",
        price: 149,
        foodType: FoodType.VEG,
      },
      {
        name: "Laccha Paratha",
        price: 99,
        foodType: FoodType.VEG,
      },
      {
        name: "Cheese Chilli Garlic Naan",
        price: 159,
        foodType: FoodType.VEG,
      },
    ],
  },
  {
    name: "Asian Veg Appetizer",
    items: [
      {
        name: "Cheese Corn Ball",
        price: 389,
        foodType: FoodType.VEG,
      },
      {
        name: "Kung Pow Paneer / Mushroom",
        price: 419,
        foodType: FoodType.VEG,
      },
      {
        name: "Soya Chaap Lollipop",
        price: 389,
        foodType: FoodType.VEG,
      },
      {
        name: "Cottage Cheese Chilli",
        price: 419,
        foodType: FoodType.VEG,
      },
      {
        name: "Oriental Stuff Cheese Mushroom",
        price: 419,
        foodType: FoodType.VEG,
      },
      {
        name: "Veg Ball Manchurian",
        price: 389,
        foodType: FoodType.VEG,
      },
      {
        name: "Paneer 65",
        price: 419,
        foodType: FoodType.VEG,
      },
      {
        name: "Paneer Thai Pai",
        price: 419,
        foodType: FoodType.VEG,
      },
      {
        name: "Paneer Thai Basil",
        price: 419,
        foodType: FoodType.VEG,
      },
      {
        name: "Veg Salt & Pepper",
        price: 389,
        foodType: FoodType.VEG,
      },
      {
        name: "Beer Batter Vegetable",
        price: 389,
        foodType: FoodType.VEG,
      },
      {
        name: "Honey Chilli Potato",
        price: 389,
        foodType: FoodType.VEG,
      },
      {
        name: "Tempura Babycorn",
        price: 389,
        foodType: FoodType.VEG,
      },
      {
        name: "Crispy Corn",
        price: 389,
        foodType: FoodType.VEG,
      },
      {
        name: "Crackling Spinach Cottage Cheese Roll",
        price: 419,
        foodType: FoodType.VEG,
      },
      {
        name: "Cottage Cheese Cigar Roll",
        price: 419,
        foodType: FoodType.VEG,
      },
      {
        name: "Dragon Roll Veg",
        price: 419,
        foodType: FoodType.VEG,
      },
    ],
  },

  {
    name: "Asian Non-Veg Appetizer",
    items: [
      {
        name: "Chicken Chilli",
        price: 459,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Chicken 65",
        price: 459,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Chicken Drum Sticks",
        foodType: FoodType.NON_VEG,
        variants: [
          {
            name: "Half",
            price: 299,
            foodType: FoodType.NON_VEG,
          },
          {
            name: "Full",
            price: 469,
            foodType: FoodType.NON_VEG,
          },
        ],
      },
      {
        name: "BBQ Chicken Wing",
        price: 469,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Ginger Garlic Chicken Wings",
        price: 469,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Pesto Chicken Bites",
        price: 459,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Chicken Ball Manchurian",
        price: 459,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Thai Basil Chicken",
        price: 459,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Kung Pow Chicken",
        price: 459,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Shanghai Chicken",
        price: 459,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Sambhal Chicken Bites",
        price: 459,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Dragon Chicken",
        price: 469,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Prawns Golden Fry",
        price: 629,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Butter Garlic Prawns",
        price: 599,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Prawns Chilli",
        price: 609,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Sweet & Tangy Prawns",
        price: 629,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Chilli Garlic Prawns",
        price: 629,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Fish Finger",
        price: 609,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Fish & Chips",
        price: 599,
        foodType: FoodType.NON_VEG,
      },
    ],
  },

  {
    name: "Charcoal Grill Veg",
    items: [
      {
        name: "Vintage Paneer",
        price: 449,
        foodType: FoodType.VEG,
      },
      {
        name: "Mushroom Nazakat Tikka",
        price: 429,
        foodType: FoodType.VEG,
      },
      {
        name: "Veg Chilli Milli Kebab",
        price: 449,
        foodType: FoodType.VEG,
      },
      {
        name: "Tandoori Aloo",
        price: 429,
        foodType: FoodType.VEG,
      },
      {
        name: "Peri Peri Paneer Tikka",
        price: 429,
        foodType: FoodType.VEG,
      },
      {
        name: "Galfi Bhutte De Kebab",
        price: 449,
        foodType: FoodType.VEG,
      },
      {
        name: "Harabhara Kebab",
        price: 449,
        foodType: FoodType.VEG,
      },
      {
        name: "Veg Seekh Kebab",
        price: 429,
        foodType: FoodType.VEG,
      },
    ],
  },

  {
    name: "Charcoal Grill Non-Veg",
    items: [
      {
        name: "Vintage Chicken",
        price: 489,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Tandoori Chicken",
        foodType: FoodType.NON_VEG,
        variants: [
          {
            name: "Half",
            price: 389,
            foodType: FoodType.NON_VEG,
          },
          {
            name: "Full",
            price: 749,
            foodType: FoodType.NON_VEG,
          },
        ],
      },
      {
        name: "Bhatti Da Murg With Desi Swad",
        price: 499,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Murg Old Monk Dum Kebab",
        price: 549,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Noorani Tangdi Kebab",
        price: 499,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Murg Gulnar Seekh Kebab",
        price: 489,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Limbu Adraki Chicken",
        price: 489,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Murg Thecha Kebab",
        price: 489,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Afghani Chicken",
        price: 489,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Peri-Peri Murg Tikka",
        price: 489,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Murg Lapeta Kebab",
        price: 529,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Amritsari Fish Tikka",
        price: 609,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Tandoori Pomfret",
        price: 699,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Prawns (Tandoori/Keralam)",
        price: 649,
        foodType: FoodType.NON_VEG,
      },
      {
        name: "Tandoori Baby Surmai",
        price: 699,
        foodType: FoodType.NON_VEG,
      },
    ],
  },
];

async function main() {
  console.log("🍽️ Starting Flutes menu import...");

  for (let categoryIndex = 0; categoryIndex < menu.length; categoryIndex++) {
    const categoryData = menu[categoryIndex];

    const category = await prisma.category.upsert({
      where: {
        name: categoryData.name,
      },
      update: {
        displayOrder: categoryIndex,
        isActive: true,
      },
      create: {
        name: categoryData.name,
        displayOrder: categoryIndex,
        isActive: true,
      },
    });

    for (
      let itemIndex = 0;
      itemIndex < categoryData.items.length;
      itemIndex++
    ) {
      const itemData = categoryData.items[itemIndex];

      const existingItem = await prisma.menuItem.findFirst({
        where: {
          categoryId: category.id,
          name: itemData.name,
        },
      });

      const item = existingItem
        ? await prisma.menuItem.update({
          where: {
            id: existingItem.id,
          },
          data: {
            description: itemData.description,
            price: itemData.price ?? 0,
            foodType: itemData.foodType,
            displayOrder: itemIndex,
          },
        })
        : await prisma.menuItem.create({
          data: {
            categoryId: category.id,
            name: itemData.name,
            description: itemData.description,
            price: itemData.price ?? 0,
            foodType: itemData.foodType,
            displayOrder: itemIndex,
            isAvailable: true,
          },
        });

      if (itemData.variants?.length) {
        await prisma.menuItemVariant.deleteMany({
          where: {
            menuItemId: item.id,
          },
        });

        await prisma.menuItemVariant.createMany({
          data: itemData.variants.map((variant, variantIndex) => ({
            menuItemId: item.id,
            name: variant.name,
            price: variant.price,
            foodType: variant.foodType ?? itemData.foodType,
            displayOrder: variantIndex,
            isAvailable: true,
          })),
        });
      }
    }

    console.log(`✅ Imported: ${category.name}`);
  }

  console.log("🎉 Flutes menu import completed!");
}

main()
  .catch((error) => {
    console.error("❌ Menu import failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });