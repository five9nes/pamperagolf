"use client";

import { useEffect, useRef } from "react";
import { MARK_CROSSES } from "@/components/logo";
import { gsap, INTRO_EVENT, introPlaying } from "@/lib/motion";

export const INTRO_SEEN_KEY = "pampera:intro";

/**
 * Runs before React loads: decides whether the intro plays (home page, first visit this
 * session, motion allowed) and marks <html> so CSS can hide it straight away otherwise.
 */
export const introScript = `(function(){var d=document.documentElement;d.classList.add("js");var play=false;try{play=location.pathname==="/"&&!sessionStorage.getItem("${INTRO_SEEN_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}d.dataset.intro=play?"playing":"done"})()`;

/** First-visit intro: the three Guarda Pampa crosses are counted in, then the panel lifts away. */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !introPlaying()) return;
    const crosses = el.querySelectorAll("path");
    // GSAP drives SVG transforms itself, so each cross needs its own centre as origin.
    gsap.set(crosses, { transformOrigin: "50% 50%" });
    const finish = () => {
      document.documentElement.dataset.intro = "done";
      try {
        sessionStorage.setItem(INTRO_SEEN_KEY, "1");
      } catch {}
    };
    const tl = gsap
      .timeline({ delay: 0.2, onComplete: finish })
      .from(crosses, { scale: 0, rotate: -90, duration: 0.6, ease: "back.out(2.2)", stagger: 0.16 })
      .from(el.querySelector("p"), { autoAlpha: 0, y: 12, duration: 0.6, ease: "expo.out" }, "<0.2")
      .to(crosses, { rotate: 90, duration: 0.7, ease: "expo.inOut", stagger: 0.05 }, "+=0.25")
      .to(el, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "-=0.2")
      .to(el.firstElementChild, { yPercent: 40, autoAlpha: 0, duration: 0.8, ease: "expo.in" }, "<")
      .call(() => window.dispatchEvent(new Event(INTRO_EVENT)), [], "<0.45");
    return () => void tl.revert();
  }, []);

  return (
    <div ref={root} className="preloader fixed inset-0 z-[60] grid place-items-center bg-coral text-ink" aria-hidden>
      <div className="flex flex-col items-center gap-6">
        <svg viewBox="0 0 386 325" className="h-16 w-auto overflow-visible sm:h-20" fill="currentColor">
          {MARK_CROSSES.map((d) => (
            <path key={d} d={d} fillRule="evenodd" />
          ))}
        </svg>
        <p className="label">The loom before the links</p>
      </div>
    </div>
  );
}
