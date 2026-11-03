import type { Metadata } from "next";
import { Glyphs } from "@/components/glyphs";
import { ProductGrid } from "@/components/product/product-grid";
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
    <>
      <section className="container-page pt-14 pb-16 text-center md:pt-24 md:pb-24">
        <p data-reveal="up" className="label text-muted">
          {site.collection.eyebrow}
        </p>
        <h1 data-reveal="lines" className="display mt-5 text-[4.5rem] md:text-[9.5rem]">
          {site.collection.title}
        </h1>
        <p data-reveal="up" className="mx-auto mt-8 max-w-md text-[15px] leading-relaxed text-muted">
          Every design is released once, in an edition of five — {site.edition.driver} driver covers and{" "}
          {site.edition.fairway} fairway wood covers. {site.leadTime}.
        </p>
        <Glyphs className="mt-10" />
      </section>

      <div className="container-page">
        <div className="grid grid-cols-2 gap-4 border-b border-line pb-4 md:grid-cols-12">
          <p className="label md:col-span-3">
            A founding collection
            <br />
            of {products.length} designs
          </p>
          <p className="label justify-self-end text-muted md:col-span-3 md:col-start-10">
            {available} of {products.length} available
          </p>
        </div>
        <ProductGrid products={products} preload={4} />
      </div>
    </>
  );
}
