"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Image as ImageType } from "@/lib/commerce/types";

/** Full-bleed swipe with a progress line on mobile; stacked column on desktop. */
export function Gallery({ images, title }: { images: ImageType[]; title: string }) {
  const strip = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  return (
    <div className="relative">
      <div
        ref={strip}
        onScroll={(e) => {
          const el = e.currentTarget;
          setProgress(el.scrollWidth > el.clientWidth ? el.scrollLeft / (el.scrollWidth - el.clientWidth) : 0);
        }}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] lg:mx-auto lg:max-w-[46rem] lg:flex-col lg:gap-2.5 lg:overflow-visible"
        aria-label={`${title} photos`}
        role="region"
        tabIndex={0}
      >
        {images.map((image, i) => {
          // Photos that aren't 4:5 (campaign shots) are shown whole: in their own shape on desktop,
          // letterboxed in the swipe frame on mobile.
          const natural = image.width > 0 && image.height > 0 && Math.abs(image.width / image.height - 0.8) > 0.01;
          return (
            <div
              key={image.url}
              style={natural ? ({ "--ar": `${image.width} / ${image.height}` } as React.CSSProperties) : undefined}
              className={`relative aspect-[4/5] w-full shrink-0 snap-center overflow-hidden lg:rounded-xl ${natural ? "bg-paper lg:aspect-[var(--ar)]" : "bg-tile"}`}
            >
              <Image
                src={image.url}
                alt={image.altText ?? title}
                fill
                preload={i === 0}
                sizes="(min-width: 1024px) 46rem, 100vw"
                className={natural ? "object-contain lg:object-cover" : "object-cover"}
              />
            </div>
          );
        })}
      </div>
      {images.length > 1 && (
        <div className="mx-3 mt-2 h-0.5 bg-line lg:hidden" aria-hidden>
          <div
            className="h-full bg-ink transition-[width] duration-150"
            style={{ width: `${Math.max(1 / images.length, progress) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
