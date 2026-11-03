import Image, { type StaticImageData } from "next/image";
import { getInstagramPosts } from "@/lib/instagram";
import { site } from "@/lib/site";
import bagTrio from "@/public/images/lifestyle/bag-trio.jpg";
import crochetDetail from "@/public/images/lifestyle/crochet-detail.jpg";
import tagDetail from "@/public/images/lifestyle/tag-detail.jpg";
import flagBag from "@/public/images/lifestyle/flag-bag.jpg";
import cartRow from "@/public/images/lifestyle/cart-row.jpg";
import clothWide from "@/public/images/lifestyle/slide-cloth-desktop.jpg";

/** Shown until an Instagram token is set (or if the API is unavailable). */
const fallback: { src: StaticImageData; alt: string }[] = [
  { src: bagTrio, alt: "Plaid, tweed and crochet covers in a stand bag" },
  { src: tagDetail, alt: "The woven Pampera label on a navy plaid cover" },
  { src: flagBag, alt: "Pampera covers in a stand bag near the flag" },
  { src: crochetDetail, alt: "Crochet patchwork and rose tweed covers up close" },
  { src: clothWide, alt: "Plaid, tweed and crochet covers in a bag on the fairway" },
  { src: cartRow, alt: "Crochet and leather covers in a bag on the cart" },
];

export function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

const tile = "group relative block aspect-square overflow-hidden rounded-xl bg-tile";
const sizes = "(min-width: 768px) 16vw, 33vw";

function Overlay() {
  return (
    <span className="absolute inset-0 grid place-items-center bg-coal/0 text-paper opacity-0 transition duration-500 ease-expo group-hover:bg-coal/35 group-hover:opacity-100">
      <InstagramGlyph className="size-6" />
    </span>
  );
}

/** Six latest posts from @pamperagolf, each linking out to Instagram. */
export async function InstagramStrip() {
  const posts = await getInstagramPosts(6);
  const handle = `@${site.instagram.handle}`;
  const external = { target: "_blank", rel: "noopener noreferrer" } as const;

  return (
    <section aria-labelledby="instagram-title" className="container-page pt-16 md:pt-24">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h2 id="instagram-title" data-reveal="lines" className="display text-[2.5rem] md:text-[4rem]">
          From the <span className="accent">pampas</span> to the course.
        </h2>
        <a href={site.instagram.url} {...external} className="link-arrow md:pb-2">
          Follow {handle}
        </a>
      </div>
      <ul className="grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3">
        {posts.length
          ? posts.map((post) => (
              <li key={post.id} data-reveal="tilt">
                <a href={post.permalink} {...external} className={tile} aria-label={`View post on Instagram${post.caption ? `: ${post.caption.slice(0, 80)}` : ""}`}>
                  <Image src={post.image} alt="" fill sizes={sizes} className="object-cover transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.05]" />
                  <Overlay />
                </a>
              </li>
            ))
          : fallback.map(({ src, alt }) => (
              <li key={alt} data-reveal="tilt">
                <a href={site.instagram.url} {...external} className={tile} aria-label={`${alt} — follow ${handle} on Instagram`}>
                  <Image src={src} alt="" fill sizes={sizes} className="object-cover transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.05]" />
                  <Overlay />
                </a>
              </li>
            ))}
      </ul>
    </section>
  );
}
