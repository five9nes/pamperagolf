import type { Metadata } from "next";
import Link from "next/link";
import { ApplyDiscount } from "@/components/apply-discount";
import { ProductGrid } from "@/components/product/product-grid";
import { commerce } from "@/lib/commerce";
import { completeTheSet, site } from "@/lib/site";

/* Landing page for the thank-you card in each box. Not linked or indexed. */
export const metadata: Metadata = {
  title: "Complete the set",
  description: `${completeTheSet.percent}% off your next Pampera cover.`,
  robots: { index: false, follow: false },
};

export default async function CompleteTheSetPage() {
  const products = await commerce.getCollectionProducts();
  // Covers that can still be ordered first.
  const sorted = [...products.filter((p) => p.availableForSale), ...products.filter((p) => !p.availableForSale)];
  return (
    <>
      <ApplyDiscount code={completeTheSet.code} />
      <section className="container-page pt-14 pb-16 text-center md:pt-24 md:pb-24">
        <p data-reveal="up" className="label text-muted">
          For Pampera owners
        </p>
        <h1 data-reveal="lines" className="display mt-5 text-[3.5rem] md:text-[8rem]">
          Complete the set.
        </h1>
        <p data-reveal="up" className="mx-auto mt-8 max-w-md text-[15px] leading-relaxed text-muted">
          Your first cover has found its bag. Add its match — the fairway to your driver, or a second design from{" "}
          {site.collection.title} — and take {completeTheSet.percent}% off.
        </p>
        <div data-reveal="up" className="mx-auto mt-10 inline-flex flex-col items-center gap-2 rounded-xl bg-tile/60 px-8 py-5">
          <span className="label text-muted">Your code</span>
          <span className="title text-2xl tracking-wide">{completeTheSet.code}</span>
          <span className="text-[12px] text-muted">Already in your bag · one per customer</span>
        </div>
        <p data-reveal="up" className="mx-auto mt-6 max-w-sm text-[12px] leading-relaxed text-muted">
          At checkout, use the email from your first order so we can recognise you. Codes can&rsquo;t be combined.{" "}
          <Link href="/shipping" className="underline underline-offset-4">
            Shipping &amp; returns
          </Link>
        </p>
      </section>
      <div className="container-page pb-24 md:pb-32">
        <ProductGrid products={sorted} preload={4} />
      </div>
    </>
  );
}
