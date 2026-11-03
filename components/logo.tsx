import Image from "next/image";
import charcoal from "@/public/brand/wordmark-charcoal.png";
import bone from "@/public/brand/wordmark-bone.png";

/** Three stepped crosses from the Guarda Pampa, measured from the brand logomark. */
const MARK_PATH =
  "M173.5 0L212.5 0L212.5 39L244.5 39L244.5 71L283.5 71L283.5 110L244.5 110L244.5 142L212.5 142L212.5 181L173.5 181L173.5 142L141.5 142L141.5 110L102.5 110L102.5 71L141.5 71L141.5 39L173.5 39ZM173.5 71L212.5 71L212.5 110L173.5 110ZM71 144L110 144L110 183L142 183L142 215L181 215L181 254L142 254L142 286L110 286L110 325L71 325L71 286L39 286L39 254L0 254L0 215L39 215L39 183L71 183ZM71 215L110 215L110 254L71 254ZM276 144L315 144L315 183L347 183L347 215L386 215L386 254L347 254L347 286L315 286L315 325L276 325L276 286L244 286L244 254L205 254L205 215L244 215L244 183L276 183ZM276 215L315 215L315 254L276 254Z";

/** The mark split into its three crosses (each outer outline plus its centre hole). */
export const MARK_CROSSES = MARK_PATH.split(/(?=M)/).reduce<string[]>(
  (crosses, part, i) => (i % 2 ? [...crosses.slice(0, -1), crosses.at(-1) + part] : [...crosses, part]),
  [],
);

/** A square frame around each cross (all three are 181 units across), for drawing them on their own. */
export const CROSS_VIEWBOXES = ["102.5 0 181 181", "0 144 181 181", "205 144 181 181"];

export function Mark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 386 325"
      className={className}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <path fillRule="evenodd" d={MARK_PATH} />
    </svg>
  );
}

export function Wordmark({
  tone = "charcoal",
  className,
  preload,
}: {
  tone?: "charcoal" | "bone";
  className?: string;
  preload?: boolean;
}) {
  return (
    <Image
      src={tone === "bone" ? bone : charcoal}
      alt="Pampera"
      className={className}
      preload={preload}
      sizes="(min-width: 768px) 480px, 70vw"
    />
  );
}

export function Lockup({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <Mark className="h-5 w-auto text-coral sm:h-6" />
      <Wordmark className="h-5 w-auto sm:h-6" preload />
    </span>
  );
}
