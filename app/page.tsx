import Image, { getImageProps, type StaticImageData } from "next/image";
import Link from "next/link";
import { HeroCarousel, type HeroSlide } from "@/components/hero-carousel";
import { ProductCard } from "@/components/product/product-card";
import { commerce } from "@/lib/commerce";
import { site } from "@/lib/site";
import heroDesktop from "@/public/images/lifestyle/hero-desktop.jpg";
import heroMobile from "@/public/images/lifestyle/hero-mobile.jpg";
import editionDesktop from "@/public/images/lifestyle/slide-edition-desktop.jpg";
import editionMobile from "@/public/images/lifestyle/slide-edition-mobile.jpg";
import clothDesktop from "@/public/images/lifestyle/slide-cloth-desktop.jpg";
import plaidDetail from "@/public/images/lifestyle/plaid-detail.jpg";
import flagBag from "@/public/images/lifestyle/flag-bag.jpg";
import swing from "@/public/images/lifestyle/swing.jpg";
import crochetDetail from "@/public/images/lifestyle/crochet-detail.jpg";
import cartRow from "@/public/images/lifestyle/cart-row.jpg";

function slide(
  desktop: StaticImageData,
  mobile: StaticImageData,
  copy: Omit<HeroSlide, "desktop" | "mobile">,
): HeroSlide {
  const { props: d } = getImageProps({ src: desktop, alt: copy.alt, sizes: "100vw" });
  const { props: m } = getImageProps({ src: mobile, alt: copy.alt, sizes: "100vw" });
  return {
    ...copy,
    desktop: d.srcSet ?? d.src,
    mobile: { src: m.src, srcSet: m.srcSet, sizes: m.sizes, width: m.width as number, height: m.height as number },
  };
}

const slides: HeroSlide[] = [
  slide(heroDesktop, heroMobile, {
    title: "The loom before the links",
    text: "The La Pampa founding collection. Headcovers cut from handwoven Argentine cloth and finished by hand.",
    href: "/shop",
    cta: "Shop",
    alt: "Pampera headcovers in a stand bag beside the green at Marine Park",
  }),
  slide(editionDesktop, editionMobile, {
    title: "Editions of five",
    text: `${site.edition.driver} driver covers and ${site.edition.fairway} fairway wood covers per cut. When the cloth is gone, the run is over.`,
    href: "/shop",
    cta: "Shop",
    alt: "Slate, coral and mustard diamond covers lying on the grass beside a golf bag",
  }),
  slide(clothDesktop, plaidDetail, {
    title: "Five pairs of hands",
    text: "Shorn, washed, spun, dyed and woven in Argentina on wooden looms. What we add is the last two steps.",
    href: "/story#the-process",
    cta: "Our Process",
    alt: "Plaid, tweed and crochet covers in a bag on the fairway",
  }),
];

function SectionHead({ title, href, cta }: { title: string; href?: string; cta?: string }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <h2 className="title text-base">{title}</h2>
      {href && (
        <Link href={href} className="label border border-line px-2 py-1 text-[11px] hover:border-ink">
          {cta}
        </Link>
      )}
    </div>
  );
}

function Tile({ src, alt, title, href, cta }: { src: StaticImageData; alt: string; title: string; href: string; cta: string }) {
  return (
    <Link href={href} className="group relative block aspect-[4/5] overflow-hidden bg-tile md:aspect-[11/10]">
      <Image src={src} alt={alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-1000 ease-out-soft group-hover:scale-[1.02]" />
      <div className="absolute inset-0 bg-black/15" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white">
        <p className="title text-3xl sm:text-4xl">{title}</p>
        <span className="btn-light">{cta}</span>
      </div>
    </Link>
  );
}

export default async function Home() {
  const products = await commerce.getCollectionProducts();

  return (
    <>
      <h1 className="sr-only">
        {site.name} — {site.tagline}
      </h1>
      <HeroCarousel slides={slides} />

      <section aria-labelledby="collection" className="container-page pt-6">
        <div id="collection">
          <SectionHead title={`${site.collection.title} — ${site.collection.eyebrow}`} href="/shop" cta="Shop All" />
        </div>
        <ul className="grid grid-cols-2 gap-x-2.5 gap-y-8 lg:grid-cols-4">
          {products.slice(0, 8).map((product, i) => (
            <li key={product.id}>
              <ProductCard product={product} preload={i < 2} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="About the edition" className="container-page mt-14">
        <dl className="grid grid-cols-3 border-y border-line py-5 text-center">
          {[
            ["Edition", "5 per cut"],
            ["Sizes", "Driver · Fairway"],
            ["Made to order", "Ships in 2–3 weeks"],
          ].map(([term, detail]) => (
            <div key={term}>
              <dt className="label text-[11px] text-muted">{term}</dt>
              <dd className="title mt-1 text-[13px] sm:text-sm">{detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-label="Explore" className="container-page mt-14 grid gap-2.5 md:grid-cols-2">
        <Tile src={plaidDetail} alt="Close-up of the navy plaid cloth with its Guarda Pampa tee band" title="The Cloth" href="/story#the-cloth" cta="Discover" />
        <Tile src={flagBag} alt="Pampera covers in a stand bag near the flag at Marine Park" title="Our Story" href="/story" cta="Read" />
      </section>

      <section aria-labelledby="on-course" className="container-page mt-14">
        <div id="on-course">
          <SectionHead title="On the course — Marine Park" />
        </div>
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
          {[
            { src: swing, alt: "A golfer swings behind a cart carrying Pampera covers", caption: "Brooklyn, NY" },
            { src: crochetDetail, alt: "Crochet patchwork and rose tweed covers up close", caption: "Crochet Patchwork" },
            { src: cartRow, alt: "Crochet and leather covers in a bag on the cart", caption: "Leather & Check" },
          ].map(({ src, alt, caption }, i) => (
            <figure key={alt} className={i === 2 ? "hidden md:block" : ""}>
              <div className="relative aspect-[3/4] overflow-hidden bg-tile">
                <Image src={src} alt={alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" />
              </div>
              <figcaption className="label mt-2 text-[11px] text-muted">{caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
