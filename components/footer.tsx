import Link from "next/link";
import { site } from "@/lib/site";
import { Mark } from "./logo";

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
      { href: "/story#the-process", label: "The Process" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="container-page grid gap-10 pt-12 pb-16 md:grid-cols-[repeat(2,12rem)_1fr]">
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="flex flex-col gap-2.5">
            <p className="label text-muted">{col.title}</p>
            {col.links.map((link) => (
              <Link key={link.href} href={link.href} className="label hover:underline hover:underline-offset-4">
                {link.label}
              </Link>
            ))}
          </nav>
        ))}
        <div className="md:justify-self-end md:text-right">
          <p className="label text-muted">{site.tagline}</p>
          <p className="mt-2.5 max-w-xs text-[13px] leading-relaxed md:ml-auto">
            Handwoven Argentine cloth, cut and finished by hand. Made in editions of five. Shipping within the United
            States.
          </p>
        </div>
      </div>
      <div className="container-page flex flex-col items-center gap-3 pb-8">
        <Mark className="h-4 w-auto text-coral" />
        <p className="label">© Pampera {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
