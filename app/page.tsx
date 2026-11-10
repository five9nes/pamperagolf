import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Glyphs } from "@/components/glyphs";
import { InstagramStrip } from "@/components/instagram-strip";
import { Mark } from "@/components/logo";
import { ProductGrid } from "@/components/product/product-grid";
import { commerce } from "@/lib/commerce";
import { clothSpec, site } from "@/lib/site";
import heroImage from "@/public/images/lifestyle/hero.jpg";
import wallPair from "@/public/images/lifestyle/wall-pair.jpg";
import tagDetail from "@/public/images/lifestyle/tag-detail.jpg";
import pond from "@/public/images/lifestyle/campaign-178.jpg";
import lakeside from "@/public/images/lifestyle/campaign-7.jpg";
import grassPair from "@/public/images/lifestyle/campaign-31.jpg";
import skyline from "@/public/images/lifestyle/campaign-228.jpg";
import stoneWall from "@/public/images/lifestyle/campaign-60.jpg";
import raised from "@/public/images/lifestyle/campaign-316.jpg";

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
  { src: pond, alt: "A golfer carries his bag up from the pond, autumn trees behind", wide: false },
  { src: lakeside, alt: "Pampera covers on a bag lying on the slope above the lake", wide: true },
  { src: grassPair, alt: "Caldén and Ñandú covers lying on the grass beside a bag", wide: false },
  { src: skyline, alt: "A golfer walks the ridge with his covers under one arm", wide: false },
  { src: stoneWall, alt: "Two bags dressed in Pampera covers against a stone wall above the course", wide: true },
  { src: raised, alt: "A golfer holds a headcover up against the sky", wide: false },
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
                  Pre-order now
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

          {/* The cloth: what it is, beside a close-up of it. */}
          <div className="container-page mt-24 grid gap-14 md:mt-36 md:grid-cols-12 md:items-center md:gap-6">
            <div className="md:col-span-5 md:col-start-2">
              <p data-reveal="up" className="label text-muted">
                The Cloth
              </p>
              <h3 data-reveal="lines" className="display mt-5 text-[2.5rem] md:text-[3.75rem]">
                Every length is counted. That number decides <span className="accent">everything.</span>
              </h3>
              <p data-reveal="up" className="mt-6 max-w-md text-[15px] leading-relaxed text-muted">
                Each length is catalogued when it comes off the loom: fibre, width, weave, weight, and how much of it
                exists. When it runs out, so does the design.
              </p>
              <dl data-reveal="up" className="mt-8 divide-y divide-line border-y border-line text-[14px]">
                {clothSpec
                  .filter(([term]) => ["Cloth", "Abrasion", "Lining", "Trim", "Closure"].includes(term))
                  .map(([term, detail]) => (
                    <div key={term} className="grid grid-cols-[6.5rem_1fr] gap-4 py-3">
                      <dt className="label pt-0.5 text-muted">{term}</dt>
                      <dd>{detail}</dd>
                    </div>
                  ))}
              </dl>
              <Link href="/story#the-cloth" className="link-arrow mt-8">
                More on the cloth
              </Link>
            </div>
            <div className="relative pb-16 md:col-span-5 md:col-start-7 md:pb-24">
              <Frame
                src={wallPair}
                alt="Caldén and Ñandú covers on a stand bag against a stone wall"
                sizes="(min-width: 768px) 40vw, 92vw"
                className="aspect-[4/5]"
              />
              <div data-parallax="-0.25" className="absolute right-4 bottom-0 w-[42%] md:-right-16">
                <Frame
                  src={tagDetail}
                  alt="The woven Pampera label"
                  sizes="(min-width: 768px) 17vw, 40vw"
                  className="aspect-[3/4] ring-8 ring-paper"
                />
              </div>
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

      {/* The edition, on orange. */}
      <div className="mt-24 md:mt-36">
        <section className="relative overflow-hidden bg-coral text-ink md:h-svh">
          <div className="flex h-full flex-col">
            <div className="container-page grid flex-1 gap-10 pt-20 pb-14 md:grid-cols-12 md:content-center md:pt-16 md:pb-8">
              <div className="md:col-span-3">
                <p className="label">The Edition</p>
                <p className="mt-4 max-w-[17rem] text-[14px] leading-relaxed">
                  Every cover is made on pre-order. Reserve one of the five, and when the run fills we cut the cloth
                  and make it by hand.
                </p>
              </div>
              <h2 data-reveal="lines" className="display text-[3rem] md:col-span-9 md:text-[5.5rem]">
                Five per run. Once all five are reserved, it goes to the <span className="accent">loom.</span>
              </h2>
              <dl className="grid grid-cols-3 gap-4 border-t border-ink/25 pt-6 md:col-span-9 md:col-start-4">
                {[
                  [String(site.edition.driver), "Driver covers"],
                  [String(site.edition.fairway), "Fairway wood covers"],
                  ["3–4", "Weeks, pre-order to your door"],
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
      </div>

      {/* On the course: pinned and scrolled sideways on desktop, swiped on mobile.
          The wrapper gives GSAP's pin-spacer a parent React doesn't remove directly, so
          client-side navigation away from this page doesn't trip over the moved node. */}
      <div>
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
      </div>

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
