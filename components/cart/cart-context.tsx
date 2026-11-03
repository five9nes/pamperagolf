"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useTransition } from "react";
import { addToCart, updateCartLine, type CartResult } from "@/lib/cart-actions";
import type { Cart } from "@/lib/commerce/types";

type CartContextValue = {
  cart: Cart | null;
  isOpen: boolean;
  isPending: boolean;
  error: string | null;
  open: () => void;
  close: () => void;
  add: (variantId: string) => Promise<boolean>;
  update: (lineId: string, quantity: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Pages are static, so the cart is loaded on the client after hydration.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/cart", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { cart: null }))
      .then((data: { cart: Cart | null }) => !cancelled && setCart(data.cart))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const apply = useCallback((result: CartResult) => {
    setCart(result.cart);
    setError(result.error ?? null);
    return !result.error;
  }, []);

  const add = useCallback(
    async (variantId: string) => {
      const ok = apply(await addToCart(variantId, 1));
      setIsOpen(true);
      return ok;
    },
    [apply],
  );

  const update = useCallback(
    (lineId: string, quantity: number) => {
      startTransition(async () => {
        apply(await updateCartLine(lineId, quantity));
      });
    },
    [apply],
  );

  const value = useMemo(
    () => ({
      cart,
      isOpen,
      isPending,
      error,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      update,
    }),
    [cart, isOpen, isPending, error, add, update],
  );

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
