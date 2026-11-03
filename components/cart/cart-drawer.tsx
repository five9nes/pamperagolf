"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { formatMoney } from "@/lib/format";
import { lockScroll } from "@/lib/motion";
import { site } from "@/lib/site";
import { useCart } from "./cart-context";

export function CartDrawer() {
  const { cart, isOpen, close, update, isPending, error } = useCart();
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (isOpen && !el.open) el.showModal();
    if (!isOpen && el.open) el.close();
    lockScroll(isOpen);
  }, [isOpen]);

  const lines = cart?.lines ?? [];

  return (
    <dialog
      ref={dialog}
      onClose={close}
      onClick={(e) => e.target === dialog.current && close()}
      aria-labelledby="cart-title"
      data-lenis-prevent
      className="m-0 ml-auto h-dvh max-h-dvh w-full max-w-md bg-paper p-0 text-ink open:flex open:flex-col"
    >
      <div className="flex h-14 items-center justify-between border-b border-line px-4">
        <h2 id="cart-title" className="label">
          Cart ({cart?.totalQuantity ?? 0})
        </h2>
        <button type="button" onClick={close} className="label -mr-2 p-2 hover:underline hover:underline-offset-4">
          Close
        </button>
      </div>

      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <p className="text-[13px] text-muted">Your cart is empty.</p>
          <Link href="/shop" onClick={close} className="btn-light border border-ink">
            Shop {site.collection.title}
          </Link>
        </div>
      ) : (
        <ul className={`flex-1 divide-y divide-line overflow-y-auto px-4 ${isPending ? "opacity-60" : ""}`}>
          {lines.map((line) => {
            const max = line.merchandise.quantityAvailable ?? Infinity;
            const image = line.merchandise.product.featuredImage;
            return (
              <li key={line.id} className="flex gap-3.5 py-4">
                <Link
                  href={`/products/${line.merchandise.product.handle}`}
                  onClick={close}
                  className="relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-lg bg-tile"
                >
                  {image && (
                    <Image src={image.url} alt={image.altText ?? ""} fill sizes="80px" className="object-cover" />
                  )}
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <div>
                      <p className="title text-[13px]">{line.merchandise.product.title}</p>
                      <p className="label mt-1 text-[11px] text-muted">{line.merchandise.title}</p>
                    </div>
                    <p className="text-[13px]">{formatMoney(line.merchandise.price)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-line">
                      <button
                        type="button"
                        aria-label={`Remove one ${line.merchandise.product.title}`}
                        disabled={isPending}
                        onClick={() => update(line.id, line.quantity - 1)}
                        className="size-8 disabled:opacity-40"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm tabular-nums" aria-live="polite">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Add one ${line.merchandise.product.title}`}
                        disabled={isPending || line.quantity >= max}
                        onClick={() => update(line.id, line.quantity + 1)}
                        className="size-8 disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => update(line.id, 0)}
                      className="label text-[11px] text-muted underline underline-offset-4"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {lines.length > 0 && cart && (
        <div className="border-t border-line px-4 py-4">
          {error && (
            <p role="alert" className="mb-3 text-sm text-coral-ink">
              {error}
            </p>
          )}
          <div className="title flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatMoney(cart.subtotal)}</span>
          </div>
          <p className="mt-1 text-[12px] text-muted">Shipping and tax calculated at checkout. {site.leadTime}.</p>
          {cart.checkoutUrl ? (
            <a
              href={cart.checkoutUrl}
              className="btn mt-4 w-full"
            >
              Checkout
            </a>
          ) : (
            <>
              <button
                type="button"
                disabled
                className="btn mt-4 w-full"
              >
                Checkout
              </button>
              <p className="mt-2 text-center text-xs text-muted">
                Preview mode — checkout opens once Shopify is connected.
              </p>
            </>
          )}
        </div>
      )}
    </dialog>
  );
}
