export interface MenuItem {
  id: number;
  name: string;
  category: string;
  type: "veg" | "nonveg";
  price: number;
  image: string;
  bestseller?: boolean;
  recommended?: boolean;
}