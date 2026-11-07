import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Mark } from "@/components/logo";
import { clothSpec, processSteps } from "@/lib/site";
import reeds from "@/public/images/lifestyle/reeds.jpg";
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
        <Image src={reeds} alt="Pampas grass and scrub at the edge of the Marine Park course" fill preload sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/55 to-black/0" />
        <div className="container-page pb-10">
          <p className="label text-white/85">Our Story</p>
          <h1 data-reveal="lines" className="display mt-3 max-w-4xl text-[2.6rem] sm:text-[4.5rem]">
            La pampa is the grassland. The pampero is the wind that crosses it.
          </h1>
        </div>
      </section>

      <div className="container-page grid gap-16 py-14 md:py-20 lg:grid-cols-[minmax(0,40rem)_1fr] lg:gap-24 lg:pl-[8vw]">
        <div className="max-w-2xl space-y-20">
          <Section eyebrow="The Origin" title="It started with a prototype on the table.">
            <p>
              My wife&rsquo;s family is Argentine. Her mother and father made everything growing up — school projects,
              costumes, whatever the house needed — and both of them can do things with a sewing machine I still
              don&rsquo;t understand.
            </p>
            <p>
              One Christmas I pitched her mother an idea: a golf headcover, but made of something real. Her curiosity
              and skills with the sewing machine took over and a couple of days later there was a prototype on the
              table.
            </p>
            <p>
              That was supposed to be where it ended. Instead it turned into a long education — in Argentine weaving,
              in the Mapuche patterns I&rsquo;d been looking at for years without understanding, and in golf in
              Argentina, which has a history of its own. The land, the wind, the coast, and generations of people who
              turned that land into cloth. Once you see all of it at once, a golf bag is an obvious place for it to go.
            </p>
            <blockquote className="border-l-2 border-coral pl-5 text-[17px] font-medium">
              I started playing golf about a year and a half ago and got obsessed the way people do. Somewhere in there
              I started noticing the bag itself — not the clubs, the things around them. Almost all of it is
              disposable.
            </blockquote>
            <p>
              After a trip to Argentina, we came home having forged connections with experienced weavers and a desire to
              create something only a true golfer could understand. What could a weaver in Argentina and a golfer in
              New York possibly have in common? An appreciation for nature and good materials.
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
