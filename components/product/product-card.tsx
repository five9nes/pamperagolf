import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/format";
import { editionProgress, sizeOf } from "@/lib/site";
import { QuickAdd } from "./quick-add";

function status(product: Product): string {
  if (!product.availableForSale) return "Fully reserved";
  const edition = editionProgress(product.variants);
  if (!edition || edition.reserved === 0) return "Pre-order";
  return `Pre-order · ${edition.reserved} of ${edition.total} reserved`;
}

export function ProductCard({ product, preload = false }: { product: Product; preload?: boolean }) {
  const [primary, secondary] = product.images;
  const price = formatMoney(product.priceRange.minVariantPrice);
  const from = product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount;
  const sizes = "(min-width: 640px) 33vw, 50vw";

  return (
    <div className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-tile">
        <Link href={`/products/${product.handle}`} aria-label={product.title} className="absolute inset-0">
          {primary && (
            <Image
              src={primary.url}
              alt={primary.altText ?? product.title}
              fill
              preload={preload}
              sizes={sizes}
              className="object-cover transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.04]"
            />
          )}
          {secondary && (
            <Image
              src={secondary.url}
              alt=""
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-opacity duration-700 ease-expo group-hover:opacity-100"
            />
          )}
        </Link>
        <span className="chip pointer-events-none absolute top-3 left-3 border-transparent bg-paper/85 text-ink backdrop-blur-sm">
          {status(product)}
        </span>
        <QuickAdd title={product.title} variants={product.variants} />
      </div>
      <Link href={`/products/${product.handle}`} className="mt-3.5 block">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="title text-[15px] sm:text-base">{product.title}</h3>
          <p className="shrink-0 text-[13px] tabular-nums">
            {from && <span className="text-muted">from </span>}
            {price}
          </p>
        </div>
        <p className="label mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted">
          {product.variants.map((v) => (
            <span key={v.id} className={v.availableForSale ? "" : "line-through opacity-60"}>
              {sizeOf(v).replace(" Wood", "")}
              {v.availableForSale && v.quantityAvailable !== null ? ` · ${v.quantityAvailable} left` : ""}
            </span>
          ))}
        </p>
      </Link>
    </div>
  );
}
