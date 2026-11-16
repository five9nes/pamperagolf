"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/cart-context";

/** Puts a code in the bag when the page opens, so customers don't have to type it. */
export function ApplyDiscount({ code }: { code: string }) {
  const { discount } = useCart();
  useEffect(() => {
    void discount(code);
  }, [code, discount]);
  return null;
}
