import type { Metadata } from "next";
import { ProductCard } from "@/components/product/product-card";
import { commerce } from "@/lib/commerce";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.collection.title} Collection`,
  description: `The ${site.collection.title} founding collection — handwoven Argentine headcovers in editions of five.`,
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const products = await commerce.getCollectionProducts();
  const available = products.filter((p) => p.availableForSale).length;
  return (
    <div className="container-page pt-6">
      <header className="flex flex-col gap-3 border-b border-line pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="title text-2xl sm:text-3xl">{site.collection.title}</h1>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
            {site.collection.eyebrow}. Every design is released once, in an edition of five — {site.edition.driver}{" "}
            driver covers and {site.edition.fairway} fairway wood covers. {site.leadTime}.
          </p>
        </div>
        <p className="label text-[11px] text-muted">
          {products.length} designs · {available} available
        </p>
      </header>
      <ul className="mt-5 grid grid-cols-2 gap-x-2.5 gap-y-8 lg:grid-cols-4">
        {products.map((product, i) => (
          <li key={product.id}>
            <ProductCard product={product} preload={i < 4} />
          </li>
        ))}
      </ul>
    </div>
  );
}
