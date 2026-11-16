"use server";

import { cookies } from "next/headers";
import { commerce, type Cart } from "./commerce";

const CART_COOKIE = "pampera_cart";
/** A code picked up from a link (e.g. /set) before there's a cart to put it on. */
const DISCOUNT_COOKIE = "pampera_discount";

export type CartResult = { cart: Cart | null; error?: string };

async function saveCartId(cartId: string) {
  (await cookies()).set(CART_COOKIE, cartId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function readCart(): Promise<Cart | null> {
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  if (!cartId) return null;
  try {
    return (await commerce.getCart(cartId)) ?? null;
  } catch (error) {
    console.error("readCart failed", error);
    return null;
  }
}

async function run(mutate: (cartId: string | undefined) => Promise<Cart>): Promise<CartResult> {
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  try {
    const cart = await mutate(cartId);
    await saveCartId(cart.id);
    return { cart };
  } catch (error) {
    console.error("Cart update failed", error);
    return { cart: await readCart(), error: "Something went wrong updating your bag. Please try again." };
  }
}

export async function addToCart(merchandiseId: string, quantity = 1): Promise<CartResult> {
  return run(async (cartId) => {
    const lines = [{ merchandiseId, quantity }];
    // A Shopify cart expires after a while; start a fresh one if the old id is gone.
    if (cartId && (await commerce.getCart(cartId).catch(() => undefined))) {
      return commerce.addToCart(cartId, lines);
    }
    const code = (await cookies()).get(DISCOUNT_COOKIE)?.value;
    return commerce.createCart(lines, code ? [code] : []);
  });
}

/** Adds a discount code to the bag now, or to the bag when it's created. */
export async function applyDiscount(code: string): Promise<CartResult> {
  const normalized = code.trim().toUpperCase();
  if (!/^[A-Z0-9_-]{3,40}$/.test(normalized)) return { cart: await readCart() };
  const jar = await cookies();
  jar.set(DISCOUNT_COOKIE, normalized, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  const cart = await readCart();
  if (!cart || cart.discountCodes.some((d) => d.code.toUpperCase() === normalized)) return { cart };
  return run(async (cartId) =>
    commerce.setDiscountCodes(cartId!, [...cart.discountCodes.map((d) => d.code), normalized]),
  );
}

export async function updateCartLine(lineId: string, quantity: number): Promise<CartResult> {
  return run(async (cartId) => {
    if (!cartId) throw new Error("No cart");
    return quantity > 0
      ? commerce.updateCart(cartId, [{ id: lineId, quantity }])
      : commerce.removeFromCart(cartId, [lineId]);
  });
}
