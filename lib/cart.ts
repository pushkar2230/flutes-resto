export type CartItem = {
  cartId: string;

  menuItemId: string;
  variantId?: string;

  name: string;
  variantName?: string;

  price: number;
  quantity: number;

  image: string | null;
  foodType: "VEG" | "NON_VEG";
};

const CART_KEY = "flutes-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(CART_KEY);

    if (!stored) {
      return [];
    }

    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(item: CartItem) {
  const cart = getCart();

  const existingIndex = cart.findIndex(
    (cartItem) => cartItem.cartId === item.cartId
  );

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }

  saveCart(cart);

  return cart;
}

export function updateCartQuantity(
  cartId: string,
  quantity: number
) {
  const cart = getCart();

  const index = cart.findIndex(
    (item) => item.cartId === cartId
  );

  if (index === -1) {
    return cart;
  }

  if (quantity <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].quantity = quantity;
  }

  saveCart(cart);

  return cart;
}

export function removeFromCart(cartId: string) {
  const cart = getCart().filter(
    (item) => item.cartId !== cartId
  );

  saveCart(cart);

  return cart;
}

export function clearCart() {
  saveCart([]);
}

export function getCartCount() {
  return getCart().reduce(
    (total, item) => total + item.quantity,
    0
  );
}

export function getCartTotal() {
  return getCart().reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}