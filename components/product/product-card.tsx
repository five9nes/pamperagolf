import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/commerce/types";
import { formatMoney } from "@/lib/format";
import { sizeOf } from "@/lib/site";
import { QuickAdd } from "./quick-add";

function statusChip(product: Product): string {
  if (!product.availableForSale) return "Sold out";
  const left = product.variants.reduce((n, v) => n + Math.max(v.quantityAvailable ?? 0, 0), 0);
  if (product.variants.every((v) => v.quantityAvailable !== null) && left <= 2) return "Almost gone";
  return "Edition of 5";
}

export function ProductCard({ product, preload = false }: { product: Product; preload?: boolean }) {
  const [primary, secondary] = product.images;
  const { minVariantPrice, maxVariantPrice } = product.priceRange;
  const price =
    minVariantPrice.amount === maxVariantPrice.amount
      ? formatMoney(minVariantPrice)
      : `${formatMoney(minVariantPrice)} – ${formatMoney(maxVariantPrice)}`;
  const sizes = "(min-width: 1024px) 25vw, 50vw";

  return (
    <div className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-tile">
        <Link href={`/products/${product.handle}`} aria-label={product.title} className="absolute inset-0">
          {primary && (
            <Image
              src={primary.url}
              alt={primary.altText ?? product.title}
              fill
              preload={preload}
              sizes={sizes}
              className="object-cover"
            />
          )}
          {secondary && (
            <Image
              src={secondary.url}
              alt=""
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </Link>
        <QuickAdd title={product.title} variants={product.variants} />
      </div>
      <Link href={`/products/${product.handle}`} className="mt-3 block">
        <span className="chip">{statusChip(product)}</span>
        <h3 className="title mt-2 text-[13px] sm:text-sm">{product.title}</h3>
        <p className="mt-1.5 text-[13px]">{price}</p>
        <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium tracking-wide text-muted uppercase">
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
