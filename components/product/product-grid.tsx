import type { Product } from "@/lib/commerce/types";
import { ProductCard } from "./product-card";

/** Catalogue grid with hairline rules between cells; cards tilt in as they enter. */
export function ProductGrid({ products, preload = 2 }: { products: Product[]; preload?: number }) {
  return (
    <ul className="grid grid-cols-2 lg:grid-cols-4">
      {products.map((product, i) => (
        <li
          key={product.id}
          className="border-b border-line p-2 pt-4 pb-8 sm:p-4 sm:pb-10 [&:nth-child(2n)]:border-l lg:[&:nth-child(2n)]:border-l-0 lg:[&:not(:nth-child(4n+1))]:border-l"
        >
          <div data-reveal="tilt">
            <ProductCard product={product} preload={i < preload} />
          </div>
        </li>
      ))}
    </ul>
  );
}
