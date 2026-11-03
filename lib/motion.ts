import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

export const EASE = "expo.out";

/** The running Lenis instance, so overlays (cart, menu) can pause page scrolling. */
let lenis: Lenis | null = null;
export const setLenis = (instance: Lenis | null) => void (lenis = instance);
export const lockScroll = (locked: boolean) => (locked ? lenis?.stop() : lenis?.start());

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Set on <html> by the inline head script; "playing" while the intro overlay runs. */
export const INTRO_EVENT = "pampera:intro-done";
export const introPlaying = () => document.documentElement.dataset.intro === "playing";

/*
 * Scroll choreography, driven by data attributes so pages stay server components:
 *
 *   data-reveal="lines"   text rises line by line out of a mask
 *   data-reveal="up"      block fades up            (data-delay="0.2")
 *   data-reveal="tilt"    cards drop in tilted and settle, batched per row
 *   data-glyphs           children pop in one after another
 *   data-parallax="0.2"   element drifts against the scroll (negative = with it)
 *   data-zoom             image inside a frame eases from 1.15 to 1 while in view
 *   data-expand           hero media grows from an inset card to full bleed
 *   data-covered          sticky panel that dims and recedes as the next sibling slides over
 *   data-horizontal       desktop: pins and scrolls its [data-track] sideways
 *   data-marquee          drifts sideways with the scroll
 */
export function choreograph(root: HTMLElement) {
  const all = (selector: string) => gsap.utils.toArray<HTMLElement>(root.querySelectorAll(selector));
  const once = (trigger: Element, start = "top 88%") => ({ trigger, start, once: true });

  for (const el of all('[data-reveal="lines"]')) {
    SplitText.create(el, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { visibility: "visible" });
        // Display type is set tight (line-height < 1), so give each mask room for descenders
        // and italic overhang without changing the line spacing.
        gsap.set(self.masks, { paddingBlock: "0.06em 0.2em", marginBlock: "-0.06em -0.2em" });
        return gsap.from(self.lines, {
          yPercent: 135,
          clearProps: "transform",
          duration: 1.25,
          ease: EASE,
          stagger: 0.09,
          delay: Number(el.dataset.delay ?? 0),
          scrollTrigger: once(el),
        });
      },
    });
  }

  for (const el of all('[data-reveal="up"]')) {
    gsap.from(el, {
      y: 48,
      autoAlpha: 0,
      duration: 1.3,
      ease: EASE,
      delay: Number(el.dataset.delay ?? 0),
      scrollTrigger: once(el, "top 92%"),
    });
  }

  const tilts = all('[data-reveal="tilt"]');
  if (tilts.length) {
    gsap.set(tilts, { autoAlpha: 0, y: 90, rotate: (i) => (i % 2 ? 7 : -6), transformOrigin: "50% 100%" });
    ScrollTrigger.batch(tilts, {
      start: "top 94%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { autoAlpha: 1, y: 0, rotate: 0, duration: 1.4, ease: EASE, stagger: 0.08, overwrite: true }),
    });
  }

  for (const el of all("[data-glyphs]")) {
    gsap.set(el, { visibility: "visible" });
    gsap.from(el.children, {
      scale: 0,
      rotate: -90,
      duration: 0.7,
      ease: "back.out(2)",
      stagger: 0.12,
      scrollTrigger: once(el, "top 95%"),
    });
  }

  for (const el of all("[data-parallax]")) {
    const speed = Number(el.dataset.parallax || 0.2);
    gsap.fromTo(
      el,
      { yPercent: -50 * speed },
      {
        yPercent: 50 * speed,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  }

  for (const el of all("[data-zoom]")) {
    gsap.fromTo(
      el,
      { scale: 1.15 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  }

  for (const el of all("[data-expand]")) {
    const media = el.querySelector("img");
    const scroll = { trigger: el, start: 0, end: "top top", scrub: true };
    gsap.fromTo(
      el,
      { clipPath: "inset(0% 2.5% 0% 2.5% round 18px)" },
      { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: scroll },
    );
    if (media) gsap.fromTo(media, { scale: 1.06 }, { scale: 1, ease: "none", scrollTrigger: scroll });
  }

  for (const el of all("[data-covered]")) {
    const next = el.nextElementSibling;
    // Only recede while actually pinned under the next panel (the edition band isn't on mobile).
    if (!next || getComputedStyle(el).position !== "sticky") continue;
    const scroll = { trigger: next, start: "top bottom", end: "top top", scrub: true };
    // force3D off keeps the panel out of a GPU layer, so its text re-renders sharp while scaled.
    gsap.to(el.firstElementChild, { scale: 0.92, yPercent: -6, ease: "none", force3D: false, scrollTrigger: scroll });
    const dim = el.querySelector("[data-dim]");
    if (dim) gsap.fromTo(dim, { opacity: 0 }, { opacity: 0.65, ease: "none", scrollTrigger: scroll });
  }

  for (const el of all("[data-marquee]")) {
    gsap.fromTo(
      el,
      { xPercent: 0 },
      {
        xPercent: -30,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  }

  const mm = gsap.matchMedia();
  mm.add("(min-width: 768px)", () => {
    for (const el of all("[data-horizontal]")) {
      const track = el.querySelector<HTMLElement>("[data-track]");
      if (!track) continue;
      const distance = () => track.scrollWidth - el.clientWidth;
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    }
  });

  return () => mm.revert();
}
