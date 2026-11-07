import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Mark } from "@/components/logo";
import { clothSpec, processSteps } from "@/lib/site";
import mate from "@/public/images/lifestyle/mate.jpg";
import tagDetail from "@/public/images/lifestyle/tag-detail.jpg";
import wallPair from "@/public/images/lifestyle/wall-pair.jpg";
import lakeside from "@/public/images/lifestyle/campaign-9.jpg";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "How a golfer in New York and weavers in Argentina ended up making headcovers — the origin, the name, the Guarda Pampa and the cloth.",
  alternates: { canonical: "/story" },
};



function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <span className="chip">{eyebrow}</span>
      <h2 data-reveal="lines" className="display mt-4 text-[2.25rem] sm:text-[3rem]">{title}</h2>
      <div className="mt-5 space-y-4 text-[15px] leading-relaxed">{children}</div>
    </section>
  );
}

export default function StoryPage() {
  return (
    <>
      <section data-tone="dark" className="relative isolate mx-[clamp(0.75rem,1.6vw,1.5rem)] flex h-[70svh] min-h-[26rem] items-end overflow-hidden rounded-[1.25rem] text-white">
        <Image src={mate} alt="A mate gourd filled with yerba, the bombilla resting in it" fill preload sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-coal/35" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-black/10 to-black/0" />
        <div className="container-page pb-10">
          <p className="label text-white/85">Our Story</p>
          <h1 data-reveal="lines" className="display mt-3 max-w-4xl text-[2.6rem] sm:text-[4.5rem]">
            It all started with a conversation over mate.
          </h1>
        </div>
      </section>

      <div className="container-page grid gap-16 py-14 md:py-20 lg:grid-cols-[minmax(0,40rem)_1fr] lg:gap-24 lg:pl-[8vw]">
        <div className="max-w-2xl space-y-20">
          <Section
            eyebrow="The Origin"
            title="Steaming water, the familiar feel of a mate passing from hand to hand and a conversation about our passions."
          >
            <p>
              Our family&rsquo;s love of golf spanned generations and countries. We wanted a way to become more
              integrated with the sport and that led to a deep education in Argentine weaving and in golf&rsquo;s history
              in Argentina. Eventually, we formed a partnership with a weaver and the rest is history.
            </p>
            <p>
              What could a weaver in Argentina and a golfer in New York have in common? A love of nature and good
              materials.
            </p>
          </Section>

          <Section eyebrow="The Name" title="Of that place, of that weather.">
            <p>
              A pampera belongs to both the grassland and the wind — of that place, of that weather. The name commits
              the brand to a landscape before it commits to a product.
            </p>
          </Section>

          <Section eyebrow="The Mark" title="The Guarda Pampa.">
            <p>
              The pattern is Mapuche. It belongs to the people of what is now southwestern Argentina and southern Chile,
              and it was theirs long before it was Argentina&rsquo;s. Among themselves they called it the Guarda del
              Cacique.
            </p>
            <p>
              It is built from staggered crosses, rhombuses, and paired triangles in horizontal symmetry — the lower
              half mirrors the upper. The reading most often given is the Andes reflected in the lakes beneath them.
              Colour carried rank: black for nobility, red for a soldier&rsquo;s courage.
            </p>
            <p>
              Gauchos adopted it. Polo adopted it after that, and along the way it became decoration. We use it knowing
              what it was and giving it new life — three stepped crosses, counted rather than sketched, because thread
              and warp permit nothing but right angles.
            </p>
            <div className="flex items-center gap-6 pt-4">
              <Mark className="h-16 w-auto text-coral" />
              <div className="guarda flex-1" aria-hidden />
            </div>
          </Section>

          <Section id="the-cloth" eyebrow="The Cloth" title="A short history of the cloth.">
            <p>Argentine weaving runs in two traditions that never fully merged.</p>
            <p>
              In the south, Mapuche weavers work wool on the telar mapuche — an upright loom — across Neuquén, Chubut,
              and Río Negro. In the north, on the Puna plateau four thousand metres up, weavers spin llama and other
              camelid fibre and take their palette from the animals rather than from dye.
            </p>
            <p>
              After the Spanish, and then the waves of European immigrants, both traditions absorbed new techniques and
              materials. What survives is neither purely pre-Hispanic nor European. It is specific to Argentina in a
              way that can&rsquo;t be reproduced anywhere else. It is also, by most accounts, disappearing.
            </p>
          </Section>

          <Section eyebrow="The Object" title="A barrel headcover, cut from handwoven cloth, lined, and finished by hand.">
            <p>
              Looped wool and alpaca woven through with mohair, brushed after the loom. Fifty thousand Martindale rubs is
              an upholstery rating — the cloth is graded for furniture people sit on every day. A headcover spends its
              life being pulled off and thrown in a bag, which is the whole reason we specified it.
            </p>
            <dl className="divide-y divide-line border-y border-line text-[14px]">
              {clothSpec.map(([term, detail]) => (
                <div key={term} className="grid grid-cols-[7.5rem_1fr] gap-4 py-3">
                  <dt className="label pt-0.5 text-muted">{term}</dt>
                  <dd>{detail}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section id="the-process" eyebrow="The Process" title="Five pairs of hands before ours.">
            <p>
              The cloth in every cover has passed through five pairs of hands before we touch it — shorn, washed, spun,
              dyed, and woven in Argentina on wooden looms, at the pace that work takes. What we add is the last two
              steps.
            </p>
            <ol className="grid gap-x-8 gap-y-6 border-t border-line pt-6 sm:grid-cols-2">
              {processSteps.map(([title, body], i) => (
                <li key={title}>
                  <p className="label text-[11px] text-coral-ink tabular-nums">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="title mt-1.5 text-sm">{title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{body}</p>
                </li>
              ))}
            </ol>
          </Section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-20 ml-auto max-w-md space-y-2.5">
            {[
              { src: tagDetail, alt: "Navy plaid cover with the woven Pampera label" },
              { src: wallPair, alt: "Caldén and Ñandú covers on a stand bag against a stone wall" },
              { src: lakeside, alt: "Pampera covers on a bag lying on the slope above the lake" },
            ].map(({ src, alt }) => (
              <div key={alt} className="relative aspect-[4/5] overflow-hidden rounded-xl bg-tile">
                <Image src={src} alt={alt} fill sizes="28rem" className="object-cover" />
              </div>
            ))}
          </div>
        </aside>
      </div>

      <section className="container-page">
        <div className="border-y border-line py-16 text-center md:py-20">
          <h2 data-reveal="lines" className="display mx-auto max-w-3xl text-[2.25rem] sm:text-[3.5rem]">
            A fabric is finished when it comes off the loom. A headcover is only the beginning.
          </h2>
          <Link
            href="/shop"
            className="btn mt-8"
          >
            Shop La Pampa
          </Link>
        </div>
      </section>
    </>
  );
}
