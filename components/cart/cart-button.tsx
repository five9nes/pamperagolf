"use client";

import { useCart } from "./cart-context";

export function CartButton() {
  const { cart, open } = useCart();
  const count = cart?.totalQuantity ?? 0;
  return (
    <button
      type="button"
      onClick={open}
      className="label -mr-2 p-2 hover:underline hover:underline-offset-4"
      aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
    >
      Cart <span className="tabular-nums">({count})</span>
    </button>
  );
}
