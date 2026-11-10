import Link from "next/link";
import { commerce } from "@/lib/commerce";
import { site } from "@/lib/site";
import { InstagramGlyph } from "./instagram-strip";
import { Mark } from "./logo";
import { PREVIEW_NOTE } from "./preview-banner";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: `${site.collection.title} Collection` },
      { href: "/shipping", label: "Shipping & Returns" },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/story", label: "Our Story" },
      { href: "/story#the-cloth", label: "The Cloth" },
    ],
  },
];

/** Sits under <main> and is uncovered as the page scrolls off (sticky on md+). */
export function Footer() {
  return (
    <footer data-tone="dark" className="bottom-0 z-0 bg-coal text-paper md:sticky">
      <div className="container-page grid gap-12 pt-20 pb-10 md:grid-cols-12 md:pt-28">
        <p className="display text-[2.25rem] md:col-span-6 md:text-[3.5rem]">
          From the pampas to the <span className="accent">course.</span>
        </p>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="flex flex-col gap-2 text-[13px] md:col-span-2 md:col-start-auto">
            <p className="label mb-2 text-dim">{col.title}</p>
            {col.links.map((link) => (
              <Link key={link.href} href={link.href} className="w-fit hover:text-coral">
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
        <div className="flex flex-col gap-2 text-[13px] md:col-span-2">
          <p className="label mb-2 text-dim">Orders</p>
          <p>{site.leadTime}.</p>
          <p>Free shipping within the United States.</p>
          <a href={`mailto:${site.email}`} className="mt-4 w-fit hover:text-coral">
            {site.email}
          </a>
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-fit items-center gap-2 hover:text-coral"
          >
            <InstagramGlyph className="size-4" />@{site.instagram.handle}
          </a>
        </div>
      </div>

      <div className="container-page">
        {/* Vector trace of the brush wordmark, so it stays sharp at full width. */}
        <img
          src="/brand/wordmark-bone.svg"
          alt={site.name}
          width={1263}
          height={337}
          loading="lazy"
          decoding="async"
          className="h-auto w-full opacity-95"
        />
      </div>

      <div className="container-page flex flex-col gap-3 py-6 text-[11px] text-dim md:flex-row md:items-center md:justify-between">
        <p className="label">© {site.name} {new Date().getFullYear()}</p>
        <Mark className="hidden h-4 w-auto text-coral md:block" />
        <p className="label">Handwoven in Argentina · Made for the golf bag</p>
        {commerce.mode === "preview" && <p className="label text-coral md:hidden">{PREVIEW_NOTE}</p>}
      </div>
    </footer>
  );
}
