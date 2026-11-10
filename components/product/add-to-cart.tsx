"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useCart } from "@/components/cart/cart-context";
import type { Variant } from "@/lib/commerce/types";
import { formatMoney, stockLabel } from "@/lib/format";
import { editionProgress, editionSizeFor, site, sizeGuide, sizeOf } from "@/lib/site";

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
  const edition = editionProgress(variants);
  const label = !selected.availableForSale
    ? `${size} — Reserved`
    : atLimit
      ? "All remaining are in your cart"
      : isPending
        ? "Reserving…"
        : "Pre-order";
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

      {edition && (
        <div className="mt-6">
          <div className="label flex items-baseline justify-between text-[11px]">
            <span>
              Edition · {edition.reserved} of {edition.total} reserved
            </span>
            {stock && <span className="text-muted">{selected.availableForSale ? `${size}: ${stock}` : `${size}: reserved`}</span>}
          </div>
          <div
            className="mt-2 grid gap-1"
            style={{ gridTemplateColumns: `repeat(${edition.total}, minmax(0, 1fr))` }}
            role="meter"
            aria-valuemin={0}
            aria-valuemax={edition.total}
            aria-valuenow={edition.reserved}
            aria-label="Covers reserved in this edition"
          >
            {Array.from({ length: edition.total }, (_, i) => (
              <span key={i} className={`h-1.5 rounded-full ${i < edition.reserved ? "bg-coral" : "bg-line"}`} />
            ))}
          </div>
          <p className="mt-2 text-[12px] text-muted">
            {edition.reserved >= edition.total
              ? "This run is fully reserved and in production."
              : `This run goes into production once all ${edition.total} are reserved.`}
          </p>
        </div>
      )}

      <button ref={mainButton} type="button" disabled={!canAdd || isPending} onClick={onAdd} className="btn mt-5 w-full">
        {label}
      </button>
      <p className="mt-3 text-center text-[12px] text-muted">
        {site.leadTime} · {site.shipping}
      </p>

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
