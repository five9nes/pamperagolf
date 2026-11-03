"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  choreograph,
  gsap,
  INTRO_EVENT,
  introPlaying,
  prefersReducedMotion,
  ScrollTrigger,
  setLenis,
} from "@/lib/motion";

/** Smooth scrolling for the whole site, plus the scroll choreography for each page. */
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.085, anchors: { offset: -72 } });
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);
    // Hold the page still while the intro overlay plays.
    const release = () => lenis.start();
    if (introPlaying()) {
      lenis.stop();
      window.addEventListener(INTRO_EVENT, release, { once: true });
    }
    return () => {
      window.removeEventListener(INTRO_EVENT, release);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const main = document.getElementById("main");
    if (!main) return;
    let ctx: gsap.Context | undefined;
    const start = () => {
      ctx = gsap.context(() => choreograph(main), main);
      ScrollTrigger.refresh();
    };
    if (introPlaying()) window.addEventListener(INTRO_EVENT, start, { once: true });
    else start();
    return () => {
      window.removeEventListener(INTRO_EVENT, start);
      ctx?.revert();
    };
  }, [pathname]);

  return null;
}
