"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useCart } from "@/components/cart/cart-context";
import type { Variant } from "@/lib/commerce/types";
import { formatMoney, stockLabel } from "@/lib/format";
import { editionSizeFor, site, sizeGuide, sizeOf } from "@/lib/site";

export function AddToCart({ title, variants }: { title: string; variants: Variant[] }) {
  const { add, cart } = useCart();
  const [selectedId, setSelectedId] = useState(
    () => (variants.find((v) => v.availableForSale) ?? variants[0])?.id,
  );
  const [isPending, startTransition] = useTransition();
  const [showBar, setShowBar] = useState(false);
  const mainButton = useRef<HTMLButtonElement>(null);
  const groupId = useId();

  // Sticky bar appears once the main button has scrolled above the viewport.
  // Measured on scroll rather than with IntersectionObserver, which misses jumps
  // (e.g. back to top) that don't cross the button's own threshold.
  useEffect(() => {
    const button = mainButton.current;
    if (!button) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      setShowBar(button.getBoundingClientRect().bottom < 0);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // Keep the end of the page (footer) clear of the bar while it's showing.
  useEffect(() => {
    document.body.style.paddingBottom = showBar ? "4rem" : "";
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [showBar]);

  const selected = variants.find((v) => v.id === selectedId);
  if (!selected) return null;

  const size = sizeOf(selected);
  const inCart = cart?.lines.find((l) => l.merchandise.id === selected.id)?.quantity ?? 0;
  const atLimit = selected.quantityAvailable !== null && inCart >= selected.quantityAvailable;
  const canAdd = selected.availableForSale && !atLimit;
  const guide = sizeGuide[size];
  const stock = stockLabel(selected.quantityAvailable, editionSizeFor(size));
  const label = !selected.availableForSale
    ? `${size} — Sold out`
    : atLimit
      ? "All remaining are in your cart"
      : isPending
        ? "Adding…"
        : "Add to Cart";
  const onAdd = () => startTransition(async () => void (await add(selected.id)));

  return (
    <div>
      <p className="text-[15px] font-medium">{formatMoney(selected.price)}</p>

      <div className="mt-7">
        <p id={groupId} className="label text-[11px]">
          Size: <span className="text-muted">{size}</span>
        </p>
        <div className="mt-3 flex gap-2" role="radiogroup" aria-labelledby={groupId}>
          {variants.map((variant) => {
            const active = variant.id === selectedId;
            return (
              <button
                key={variant.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSelectedId(variant.id)}
                className={`label flex-1 border-b-2 pt-2 pb-2.5 text-[11px] transition-colors ${
                  active ? "border-ink" : "border-line hover:border-muted"
                } ${variant.availableForSale ? "" : "text-muted line-through"}`}
              >
                {sizeOf(variant)}
              </button>
            );
          })}
        </div>
        {guide && (
          <p className="mt-3 text-[13px] text-muted">
            {guide.fits}. {guide.dimensions}.
          </p>
        )}
      </div>

      {stock && (
        <p className="mt-5 flex items-center gap-2 text-[13px]">
          <span
            className={`inline-block size-2 rounded-full ${selected.availableForSale ? "bg-coral" : "bg-line"}`}
            aria-hidden
          />
          {selected.availableForSale ? `${stock} in this edition` : "This size has sold through"}
        </p>
      )}

      <button ref={mainButton} type="button" disabled={!canAdd || isPending} onClick={onAdd} className="btn mt-5 w-full">
        {label}
      </button>
      <p className="mt-3 text-center text-[12px] text-muted">{site.leadTime}</p>

      <div
        aria-hidden={!showBar}
        inert={!showBar}
        className={`fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 backdrop-blur transition-transform duration-300 ${
          showBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <p className="title hidden text-sm sm:block">
            {title} <span className="mx-2" aria-hidden>•</span> {size}{" "}
            <span className="mx-2" aria-hidden>•</span> {formatMoney(selected.price)}
          </p>
          <button type="button" disabled={!canAdd || isPending} onClick={onAdd} className="btn w-full sm:w-64">
            {label}
          </button>
        </div>
      </div>
    </div>
  );
}
