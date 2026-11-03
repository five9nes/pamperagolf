"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export type HeroSlide = {
  title: string;
  text: string;
  href: string;
  cta: string;
  alt: string;
  /** srcSet for ≥768px (landscape) */
  desktop: string;
  /** Props for the <img> fallback (portrait, mobile) */
  mobile: { src: string; srcSet?: string; sizes?: string; width?: number; height?: number };
};

const INTERVAL = 6500;

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((i: number) => setIndex((i + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => go(index + 1), INTERVAL);
    return () => window.clearTimeout(id);
  }, [index, paused, go, slides.length]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured"
      className="relative isolate h-[78svh] min-h-[30rem] overflow-hidden bg-ink text-white md:h-[82vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {slides.map((slide, i) => {
        const active = i === index;
        return (
          <div
            key={slide.title}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            aria-hidden={!active}
            inert={!active}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out-soft ${active ? "opacity-100" : "opacity-0"}`}
          >
            <picture>
              <source media="(min-width: 768px)" srcSet={slide.desktop} sizes="100vw" />
              <img
                {...slide.mobile}
                alt={slide.alt}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
                decoding="async"
                className="absolute inset-0 size-full object-cover"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 px-3 pb-14 md:pb-16">
              <h2 className="title max-w-3xl text-[2rem] sm:text-5xl">{slide.title}</h2>
              <p className="mt-2 max-w-md text-[13px] leading-snug text-white/90 sm:text-sm">{slide.text}</p>
              <Link href={slide.href} className="btn-light mt-5">
                {slide.cta}
              </Link>
            </div>
          </div>
        );
      })}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="absolute top-1/2 left-2 hidden -translate-y-1/2 p-2 text-2xl leading-none text-white/90 hover:text-white md:block"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="absolute top-1/2 right-2 hidden -translate-y-1/2 p-2 text-2xl leading-none text-white/90 hover:text-white md:block"
          >
            ›
          </button>
          <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2.5">
            {slides.map((slide, i) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={`size-2 rounded-full border border-white transition-colors ${i === index ? "bg-white" : "bg-transparent"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
