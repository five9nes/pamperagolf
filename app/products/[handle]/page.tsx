import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/product/add-to-cart";
import { Gallery } from "@/components/product/gallery";
import { commerce } from "@/lib/commerce";
import { materials, site } from "@/lib/site";

export async function generateStaticParams() {
  const products = await commerce.getCollectionProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: PageProps<"/products/[handle]">): Promise<Metadata> {
  const product = await commerce.getProduct((await params).handle);
  if (!product) return {};
  const image = product.images[0];
  return {
    title: product.seo.title ?? product.title,
    description: product.seo.description ?? product.description,
    alternates: { canonical: `/products/${product.handle}` },
    openGraph: image ? { images: [{ url: image.url, width: image.width, height: image.height }] } : undefined,
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[handle]">) {
  const product = await commerce.getProduct((await params).handle);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    name: product.title,
    description: product.description,
    url: `${site.url}/products/${product.handle}`,
    brand: { "@type": "Brand", name: site.name },
    image: product.images.map((i) => i.url.startsWith("/") ? `${site.url}${i.url}` : i.url),
    variesBy: "https://schema.org/size",
    hasVariant: product.variants.map((v) => ({
      "@type": "Product",
      name: `${product.title} — ${v.title}`,
      size: v.title,
      offers: {
        "@type": "Offer",
        price: v.price.amount,
        priceCurrency: v.price.currencyCode,
        availability: v.availableForSale ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="lg:container-page lg:pt-4">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_26rem]">
          <Gallery images={product.images} title={product.title} />

          <div className="container-page pt-6 lg:sticky lg:top-20 lg:self-start lg:px-0 lg:pt-12 lg:pr-6">
            <nav aria-label="Breadcrumb" className="label mb-5 text-[11px] text-muted">
              <Link href="/shop" className="hover:text-ink">
                {site.collection.title}
              </Link>
              <span className="mx-1.5" aria-hidden>/</span>
              <span aria-current="page">{product.title}</span>
            </nav>
            <span className="chip">{product.availableForSale ? site.collection.eyebrow : "Sold out"}</span>
            <h1 className="display mt-4 text-[2.5rem] sm:text-[3rem]">{product.title}</h1>
            {product.subtitle && <p className="mt-2 text-[14px] text-muted">{product.subtitle}</p>}

            <div className="mt-5">
              <AddToCart title={product.title} variants={product.variants} />
            </div>

            <div
              className="mt-8 space-y-3 text-[13px] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />

            <ul className="mt-5 list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed marker:text-muted">
              {materials.map(([term, detail]) => (
                <li key={term}>
                  {term}: {detail}
                </li>
              ))}
            </ul>

            <p className="mt-6 border-t border-line pt-5 text-[13px] leading-relaxed text-muted">
              Each cut is released once — {site.edition.driver} driver covers and {site.edition.fairway} fairway wood
              covers. When the cloth is gone, the run is over.{" "}
              <Link href="/shipping" className="text-ink underline underline-offset-4">
                Shipping &amp; returns
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
