import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Glyphs } from "@/components/glyphs";
import { InstagramStrip } from "@/components/instagram-strip";
import { Mark } from "@/components/logo";
import { ProductGrid } from "@/components/product/product-grid";
import { commerce } from "@/lib/commerce";
import { processSteps, site } from "@/lib/site";
import heroImage from "@/public/images/lifestyle/hero.jpg";
import plaidDetail from "@/public/images/lifestyle/plaid-detail.jpg";
import tagDetail from "@/public/images/lifestyle/tag-detail.jpg";
import crochetDetail from "@/public/images/lifestyle/crochet-detail.jpg";
import bagTrio from "@/public/images/lifestyle/bag-trio.jpg";
import swing from "@/public/images/lifestyle/swing.jpg";
import flagBag from "@/public/images/lifestyle/flag-bag.jpg";
import fairwayWide from "@/public/images/lifestyle/fairway-wide.jpg";
import cartRow from "@/public/images/lifestyle/cart-row.jpg";
import editionWide from "@/public/images/lifestyle/slide-edition-desktop.jpg";
import reeds from "@/public/images/lifestyle/reeds.jpg";

/** A rounded photo frame whose image drifts inside it on scroll. */
function Frame({ src, alt, sizes, className = "" }: { src: StaticImageData; alt: string; sizes: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-tile ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} data-zoom className="object-cover" />
    </div>
  );
}

function HeroMedia() {
  return (
    <Image
      src={heroImage}
      alt="A Pampera headcover in a slate-green diamond weave lying on grass among fallen leaves"
      fill
      preload
      sizes="100vw"
      className="object-cover"
    />
  );
}

const course = [
  { src: swing, alt: "A golfer swings behind a cart carrying Pampera covers", wide: false },
  { src: editionWide, alt: "Slate, coral and mustard diamond covers on the grass beside a bag", wide: true },
  { src: flagBag, alt: "Pampera covers in a stand bag near the flag", wide: false },
  { src: fairwayWide, alt: "Two bags on the fairway", wide: false },
  { src: reeds, alt: "Pampas grass and scrub at the edge of the course", wide: true },
  { src: cartRow, alt: "Crochet and leather covers in a bag on the cart", wide: false },
];

export default async function Home() {
  const products = await commerce.getCollectionProducts();

  return (
    <>
      {/* Hero: corner notes and a large line, with the photo below growing to full bleed. */}
      <section className="container-page pt-8 md:pt-14">
        <div className="grid gap-5 md:grid-cols-12 md:items-end">
          <p data-reveal="up" data-delay="0.35" className="label order-2 md:order-none md:col-span-3 md:pb-3">
            {site.collection.title}
            <br />
            {site.collection.eyebrow}
          </p>
          <h1
            data-reveal="lines"
            className="display order-1 text-[3.6rem] sm:text-[5.5rem] md:order-none md:col-span-6 md:text-[6.4rem] xl:text-[8rem]"
          >
            The loom before the <span className="accent">links.</span>
          </h1>
          <div
            data-reveal="up"
            data-delay="0.5"
            className="order-3 max-w-[17rem] md:col-span-3 md:justify-self-end md:pb-3"
          >
            <p className="label text-muted">
              Golf headcovers cut from cloth handwoven in Argentina. Each run is numbered. When the cloth is gone,
              it&rsquo;s gone.
            </p>
            <Link href="/shop" className="btn mt-5">
              Shop {site.collection.title}
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-8 md:mt-12">
        <div data-covered className="sticky top-0 aspect-[43/24] max-h-svh w-full overflow-hidden">
          <div className="relative h-full">
            <div data-expand data-tone="dark" className="relative h-full overflow-hidden bg-night">
              <HeroMedia />
              <div className="absolute inset-0 hidden bg-gradient-to-t from-black/40 via-transparent via-30% md:block" />
              <div className="container-page absolute inset-x-0 bottom-0 hidden items-end justify-between gap-6 pb-6 text-paper md:flex">
                <p className="label">
                  Handwoven in Argentina
                  <br />
                  Finished by hand
                </p>
                <p className="label text-right">
                  {site.edition.driver + site.edition.fairway} per design
                  <br />
                  Made to order
                </p>
              </div>
            </div>
            <div data-dim className="pointer-events-none absolute inset-0 bg-coal opacity-0" />
          </div>
        </div>

        {/* Slides up over the hero photo. */}
        <section className="relative z-10 rounded-t-[1.75rem] bg-paper pt-24 pb-10 md:pt-40">
          <div className="container-page text-center">
            <p data-reveal="up" className="label text-muted">
              The Object
            </p>
            <h2
              data-reveal="lines"
              className="display mx-auto mt-6 max-w-6xl text-[2.6rem] sm:text-[3.75rem] md:text-[5.25rem]"
            >
              A barrel headcover, cut from <span className="accent">handwoven</span> cloth, lined and finished in the workshop.
            </h2>
            <p data-reveal="up" className="mx-auto mt-10 max-w-md text-[15px] leading-relaxed text-muted">
              Looped wool and alpaca, woven through with mohair and brushed once it comes off the loom. The cloth is
              rated to 50,000 Martindale rubs, an upholstery standard, for something that spends its life being pulled
              off and thrown in a bag.
            </p>
            <Glyphs className="mt-10" />
          </div>

          {/* Photos scattered at different depths around a pinned line. */}
          <div className="relative mt-16 h-[120svh] md:mt-10 md:h-[175vh]">
            <div className="absolute inset-x-0 top-[40%] z-10 container-page text-center md:sticky md:top-[38svh]">
              <p className="display mx-auto max-w-xl text-[2rem] md:text-[3rem]">
                Every length is counted. That number decides <span className="accent">everything.</span>
              </p>
              <Link href="/story#the-cloth" className="link-arrow mt-6">
                The cloth
              </Link>
            </div>
            <div data-parallax="0.5" className="absolute z-20 top-[2%] left-[4%] w-[38vw] md:left-[8%] md:w-[19vw]">
              <Frame src={plaidDetail} alt="Navy plaid cloth with its Guarda Pampa band" sizes="(min-width: 768px) 19vw, 38vw" className="aspect-[3/4]" />
            </div>
            <div data-parallax="-0.3" className="absolute z-20 top-[8%] right-[6%] md:top-[14%] w-[30vw] md:right-[10%] md:w-[14vw]">
              <Frame src={tagDetail} alt="The woven Pampera label" sizes="(min-width: 768px) 14vw, 30vw" className="aspect-[3/4]" />
            </div>
            <div data-parallax="0.9" className="absolute z-20 top-[66%] left-[6%] md:top-[58%] w-[34vw] md:left-[18%] md:w-[16vw]">
              <Frame src={crochetDetail} alt="Crochet patchwork and rose tweed up close" sizes="(min-width: 768px) 16vw, 34vw" className="aspect-[3/4]" />
            </div>
            <div data-parallax="0.35" className="absolute z-20 top-[72%] right-[4%] md:top-[66%] w-[42vw] md:right-[16%] md:w-[22vw]">
              <Frame src={bagTrio} alt="Plaid, tweed and crochet covers in a stand bag" sizes="(min-width: 768px) 22vw, 42vw" className="aspect-[3/4]" />
            </div>
          </div>
        </section>
      </div>

      {/* The collection, in a ruled catalogue grid. */}
      <section className="container-page pt-16 md:pt-24" aria-labelledby="collection-title">
        <div className="grid gap-4 border-b border-line pb-6 md:grid-cols-12 md:items-end">
          <p className="label text-muted md:col-span-3 md:pb-2">
            {site.collection.eyebrow}
            <br />
            {products.length} designs
          </p>
          <h2 id="collection-title" data-reveal="lines" className="display text-[3.4rem] md:col-span-6 md:text-[6.5rem]">
            {site.collection.title}
          </h2>
          <Link href="/shop" className="link-arrow md:col-span-3 md:justify-self-end md:pb-2">
            Shop all
          </Link>
        </div>
        <ProductGrid products={products.slice(0, 8)} />
      </section>

      {/* The edition, on orange and pinned; the dark panel below slides over it. */}
      <div className="mt-24 md:mt-36">
        <section className="relative overflow-hidden bg-coral text-ink md:sticky md:top-0 md:h-svh">
          <div className="flex h-full flex-col">
            <div className="container-page grid flex-1 gap-10 pt-20 pb-14 md:grid-cols-12 md:content-center md:pt-16 md:pb-8">
              <p className="label md:col-span-3">The Edition</p>
              <h2 data-reveal="lines" className="display text-[3rem] md:col-span-9 md:text-[5.5rem]">
                Five per cut. When the cloth is gone, the run is <span className="accent">over.</span>
              </h2>
              <dl className="grid grid-cols-3 gap-4 border-t border-ink/25 pt-6 md:col-span-9 md:col-start-4">
                {[
                  [String(site.edition.driver), "Driver covers"],
                  [String(site.edition.fairway), "Fairway wood covers"],
                  ["2–3", "Weeks, made to order"],
                ].map(([value, term]) => (
                  <div key={term} data-reveal="up" className="flex flex-col-reverse gap-2">
                    <dt className="label">{term}</dt>
                    <dd className="display text-[3rem] md:text-[5.5rem]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div aria-hidden className="overflow-hidden pb-8">
              <div data-marquee className="guarda w-[200%]" style={{ backgroundColor: "var(--color-ink)" }} />
            </div>
          </div>
        </section>

        <section data-tone="dark" className="relative z-10 rounded-t-[1.75rem] bg-night text-paper">
          <div className="container-page grid gap-12 pt-24 pb-24 md:grid-cols-12 md:pt-36 md:pb-32">
            <h2 data-reveal="lines" className="display text-[2.75rem] md:col-span-6 md:text-[4.75rem]">
              Five pairs of hands before <span className="accent">ours.</span>
            </h2>
            <div className="space-y-5 text-[15px] leading-relaxed text-paper/75 md:col-span-5 md:col-start-8 md:pt-3">
              <p data-reveal="up">
                The cloth in every cover has passed through five pairs of hands before we touch it — shorn, washed,
                spun, dyed, and woven in Argentina on wooden looms, at the pace that work takes.
              </p>
              <p data-reveal="up">
                What we add is the last two steps: cut to the pattern, lined in pile, banded with the Guarda Pampa,
                and numbered.
              </p>
              <div data-reveal="up" className="flex items-center gap-6 pt-4">
                <Frame src={plaidDetail} alt="" sizes="12rem" className="h-20 w-40 rounded-full md:h-24 md:w-48" />
                <Link href="/story#the-process" className="link-arrow text-paper">
                  Our process
                </Link>
              </div>
            </div>
            <ol className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line-dark pt-10 md:col-span-12 md:grid-cols-6">
              {processSteps.map(([title, body], i) => (
                <li key={title} data-reveal="up" data-delay={String((i % 6) * 0.06)}>
                  <p className="label text-coral tabular-nums">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="title mt-3 text-lg">{title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-dim">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>

      {/* On the course: pinned and scrolled sideways on desktop, swiped on mobile. */}
      <section data-horizontal aria-labelledby="course-title" className="overflow-hidden py-20 md:h-svh md:py-0">
        <div
          data-track
          className="container-page flex h-full snap-x snap-mandatory items-center gap-3 overflow-x-auto [scrollbar-width:none] md:w-max md:gap-5 md:overflow-visible"
        >
          <div className="w-[70vw] shrink-0 snap-start pr-6 md:w-[30vw] md:pr-10">
            <h2 id="course-title" data-reveal="lines" className="display text-[3rem] md:text-[5.5rem]">
              On the <span className="accent">course.</span>
            </h2>
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-muted">
              The founding collection, out where it belongs.
            </p>
          </div>
          {course.map(({ src, alt, wide }) => (
            <Frame
              key={alt}
              src={src}
              alt={alt}
              sizes={wide ? "(min-width: 768px) 60vw, 85vw" : "(min-width: 768px) 28vw, 62vw"}
              className={`h-[58svh] shrink-0 snap-start md:h-[68vh] ${wide ? "aspect-[3/2] max-w-[85vw]" : "aspect-[3/4]"}`}
            />
          ))}
        </div>
      </section>

      <InstagramStrip />

      {/* Closing call before the footer is revealed underneath. */}
      <section className="container-page pt-16 pb-28 text-center md:pt-24 md:pb-40">
        <Mark className="mx-auto h-10 w-auto text-coral" />
        <h2 data-reveal="lines" className="display mx-auto mt-8 max-w-4xl text-[2.75rem] md:text-[5rem]">
          Released once. Numbered by <span className="accent">hand.</span>
        </h2>
        <Link href="/shop" data-reveal="up" className="btn mt-10">
          Shop {site.collection.title}
        </Link>
      </section>
    </>
  );
}
