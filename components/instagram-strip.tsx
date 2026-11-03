import { site } from "@/lib/site";

export function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** A simple follow call-out for @pamperagolf. */
export function InstagramStrip() {
  return (
    <section aria-labelledby="instagram-title" className="container-page pt-16 md:pt-24">
      <a
        href={site.instagram.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col items-start gap-6 border-y border-line py-10 md:flex-row md:items-center md:justify-between md:py-14"
      >
        <h2 id="instagram-title" data-reveal="lines" className="display text-[2.5rem] md:text-[4.5rem]">
          Follow us on <span className="accent">Instagram.</span>
        </h2>
        <span className="flex items-center gap-3 text-[15px] font-medium transition-colors duration-300 group-hover:text-coral-ink">
          <InstagramGlyph className="size-6" />@{site.instagram.handle}
          <span aria-hidden className="transition-transform duration-500 ease-expo group-hover:translate-x-1">
            →
          </span>
        </span>
      </a>
    </section>
  );
}
