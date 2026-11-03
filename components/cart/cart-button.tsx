"use client";

import { useCart } from "./cart-context";

export function CartButton() {
  const { cart, open } = useCart();
  const count = cart?.totalQuantity ?? 0;
  return (
    <button
      type="button"
      onClick={open}
      className="flex items-center gap-1.5"
      aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
    >
      Cart
      <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-coral px-1 text-[10px] text-ink tabular-nums">
        {count}
      </span>
    </button>
  );
}
