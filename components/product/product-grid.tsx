import type { Product } from "@/lib/commerce/types";
import { ProductCard } from "./product-card";

/** Catalogue grid with hairline rules between cells; cards tilt in as they enter. */
export function ProductGrid({ products, preload = 2 }: { products: Product[]; preload?: number }) {
  return (
    <ul className="grid sm:grid-cols-3">
      {products.map((product, i) => (
        <li
          key={product.id}
          className="border-b border-line px-0 pt-4 pb-10 sm:p-4 sm:pb-10 sm:[&:not(:nth-child(3n+1))]:border-l"
        >
          <div data-reveal="tilt">
            <ProductCard product={product} preload={i < preload} />
          </div>
        </li>
      ))}
    </ul>
  );
}
