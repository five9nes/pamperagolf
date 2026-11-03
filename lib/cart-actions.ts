"use server";

import { cookies } from "next/headers";
import { commerce, type Cart } from "./commerce";

const CART_COOKIE = "pampera_cart";

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
    return commerce.createCart(lines);
  });
}

export async function updateCartLine(lineId: string, quantity: number): Promise<CartResult> {
  return run(async (cartId) => {
    if (!cartId) throw new Error("No cart");
    return quantity > 0
      ? commerce.updateCart(cartId, [{ id: lineId, quantity }])
      : commerce.removeFromCart(cartId, [lineId]);
  });
}
