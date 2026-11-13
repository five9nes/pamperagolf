import type { Metadata } from "next";
import { preorder, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "Lead times, US shipping, and returns for handmade Pampera headcovers.",
  alternates: { canonical: "/shipping" },
};

/*
 * Keep this page in sync with the policies set in Shopify Admin → Settings → Policies (checkout links to those).
 */
const email = (
  <a href={`mailto:${site.email}`} className="underline underline-offset-4">
    {site.email}
  </a>
);

const sections: { title: string; body: React.ReactNode[] }[] = [
  {
    title: "Pre-order",
    body: [
      `Every cover is sold on pre-order. Each design is made in runs of five — ${site.edition.driver} driver and ${site.edition.fairway} fairway wood covers — and once all five in a run are reserved, the cloth is cut and the covers are made by hand.`,
      `Production starts by ${preorder.deadline} at the latest, whether or not a run has filled, so no one waits on a run that never completes.`,
      "Most orders arrive in about 3–4 weeks. We'll email you when your run goes into production, and again with a tracking link when it ships.",
      "If we can't ship within the stated time, we'll email you before it lapses with a new date and the option to cancel for a full refund.",
    ],
  },
  {
    title: "Shipping",
    body: [
      "Shipping is free on every order. We ship within the United States only for now.",
      "Orders ship from Queens, New York.",
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
      "You can return a cover within 30 days of delivery for a full refund, as long as it's unused and in its original condition.",
      <>
        To start a return, email {email} with your order number and we&rsquo;ll send instructions. Refunds go back to
        your original payment method once the cover reaches us.
      </>,
      <>
        If your cover arrives damaged or faulty, email {email} within 14 days of delivery and we&rsquo;ll make it right.
      </>,
    ],
  },
  {
    title: "Contact",
    body: [<>Questions about an order, sizing or anything else: {email}.</>],
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
              {section.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
