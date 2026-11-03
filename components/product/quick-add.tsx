"use client";

import { useState, useTransition } from "react";
import { useCart } from "@/components/cart/cart-context";
import type { Variant } from "@/lib/commerce/types";
import { sizeOf } from "@/lib/site";

/** "+" on a product tile: pick a size and add without leaving the grid. */
export function QuickAdd({ title, variants }: { title: string; variants: Variant[] }) {
  const { add, cart } = useCart();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!variants.some((v) => v.availableForSale)) return null;

  return (
    <div className="absolute inset-x-3 bottom-3 flex flex-col items-end gap-2">
      {open && (
        <div className="flex w-full gap-1.5" role="group" aria-label={`Add ${title} to cart`}>
          {variants.map((variant) => {
            const inCart = cart?.lines.find((l) => l.merchandise.id === variant.id)?.quantity ?? 0;
            const full = variant.quantityAvailable !== null && inCart >= variant.quantityAvailable;
            const disabled = !variant.availableForSale || full || isPending;
            return (
              <button
                key={variant.id}
                type="button"
                disabled={disabled}
                onClick={() =>
                  startTransition(async () => {
                    await add(variant.id);
                    setOpen(false);
                  })
                }
                className={`label h-9 flex-1 rounded-full bg-paper/95 backdrop-blur-sm transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:text-muted disabled:hover:bg-paper/95 ${
                  variant.availableForSale ? "" : "line-through"
                }`}
              >
                {sizeOf(variant).replace(" Wood", "")}
              </button>
            );
          })}
        </div>
      )}
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close size options" : `Quick add ${title}`}
        onClick={() => setOpen((o) => !o)}
        className="grid size-9 place-items-center rounded-full bg-paper/90 text-lg leading-none backdrop-blur-sm transition-colors duration-300 hover:bg-coral"
      >
        <span aria-hidden className={`transition-transform ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
    </div>
  );
}
