import { CROSS_VIEWBOXES, MARK_CROSSES } from "@/components/logo";

/** The three crosses of the mark, set level and evenly spaced as a divider; they pop in on scroll. */
export function Glyphs({ className = "" }: { className?: string }) {
  return (
    <div data-glyphs aria-hidden className={`flex items-center justify-center gap-4 ${className}`}>
      {MARK_CROSSES.map((d, i) => (
        <svg key={d} viewBox={CROSS_VIEWBOXES[i]} className="size-3.5" fill="currentColor">
          <path d={d} fillRule="evenodd" />
        </svg>
      ))}
    </div>
  );
}
