"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  choreograph,
  gsap,
  INTRO_EVENT,
  introPlaying,
  prefersReducedMotion,
  resetScroll,
  ScrollTrigger,
  setLenis,
} from "@/lib/motion";

/** Smooth scrolling for the whole site, plus the scroll choreography for each page. */
export function Motion() {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const fromHistory = useRef(false);

  // Back/forward should keep the position the browser restores; anything else starts at the top.
  useEffect(() => {
    const onPop = () => void (fromHistory.current = true);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

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
    // Without this, a click made while Lenis is still easing carries that momentum onto the new
    // page and it opens partway down.
    if (!firstRender.current) resetScroll(fromHistory.current ? window.scrollY : 0);
    firstRender.current = false;
    fromHistory.current = false;

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
