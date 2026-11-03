import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "Lead times, US shipping, and returns for handmade Pampera headcovers.",
  alternates: { canonical: "/shipping" },
};

/*
 * TODO(owner): the bracketed items below are placeholders — confirm the returns
 * policy, origin city and carrier before launch. Keep this page in sync with the
 * policies set in Shopify Admin → Settings → Policies (checkout links to those).
 */
const sections = [
  {
    title: "Made to order",
    body: [
      `Every cover is cut and finished by hand after you order. ${site.leadTime}, and you'll get a tracking link by email when it leaves the workshop.`,
      "If we can't ship within the stated time, we'll email you before it lapses with a new date and the option to cancel for a full refund.",
    ],
  },
  {
    title: "Shipping",
    body: [
      "We ship within the United States only for now. Rates are calculated at checkout.",
      "[Ships from New York or Miami — to be confirmed.] [Carrier and service level — to be confirmed.]",
    ],
  },
  {
    title: "Editions",
    body: [
      `Each design is released once, in an edition of five — ${site.edition.driver} driver covers and ${site.edition.fairway} fairway wood covers. When an edition sells through, it isn't remade.`,
    ],
  },
  {
    title: "Returns",
    body: [
      "[Returns policy to be confirmed — e.g. whether made-to-order covers are final sale, or returnable within a set window in unused condition.]",
      "If your cover arrives damaged or faulty, contact us and we'll make it right. [Claim window and contact email — to be confirmed.]",
    ],
  },
];

export default function ShippingPage() {
  return (
    <div className="container-page max-w-3xl pt-8 sm:mx-auto sm:pt-12">
      <span className="chip">Help</span>
      <h1 className="title mt-3 text-2xl sm:text-3xl">Shipping &amp; Returns</h1>
      <div className="mt-8 divide-y divide-line border-t border-line">
        {sections.map((section) => (
          <section key={section.title} className="grid gap-3 py-8 sm:grid-cols-[11rem_1fr] sm:gap-8">
            <h2 className="label pt-0.5">{section.title}</h2>
            <div className="space-y-3 text-[14px] leading-relaxed">
              {section.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
