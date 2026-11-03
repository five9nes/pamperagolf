import { MARK_CROSSES } from "@/components/logo";

/** The three crosses of the mark as a small row of glyphs that pop in on scroll. */
export function Glyphs({ className = "" }: { className?: string }) {
  return (
    <div data-glyphs aria-hidden className={`flex items-center justify-center gap-2 ${className}`}>
      {MARK_CROSSES.map((d) => (
        <svg key={d} viewBox="0 0 386 325" className="h-4 w-auto" fill="currentColor">
          <path d={d} fillRule="evenodd" />
        </svg>
      ))}
    </div>
  );
}
