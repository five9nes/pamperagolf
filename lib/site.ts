export const site = {
  name: "Pampera",
  tagline: "The loom before the links",
  description:
    "Golf headcovers cut from handwoven Argentine cloth and finished by hand. Made in editions of five — when the cloth is gone, the run is over.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pamperagolf.com",
  email: "hello@pamperagolf.com",
  instagram: { handle: "pamperagolf", url: "https://www.instagram.com/pamperagolf" },
  collection: {
    title: "Las Pampas",
    eyebrow: "The Founding Collection",
  },
  /** Every cut is released as one edition: 3 driver covers + 2 fairway wood covers. */
  edition: { driver: 3, fairway: 2 },
  leadTime: "Pre-order — ships in about 3–4 weeks",
  shipping: "Free shipping within the US",
} as const;

/** Fit notes per size, keyed by the Shopify "Size" option value. */
export const sizeGuide: Record<string, { fits: string; dimensions: string }> = {
  Driver: {
    fits: "Fits 400–460cc drivers",
    dimensions: "Approx. 27 cm tall, 16 cm opening",
  },
  "Fairway Wood": {
    fits: "Fits all fairway woods",
    dimensions: "Approx. 24 cm tall, 15 cm opening",
  },
};

/** Specification of the founding cloth, from the brand book. */
export const clothSpec = [
  ["Cloth", "Wool 45% · Alpaca 20% · Mohair 20% · Polyamide 15%"],
  ["Width", "138 cm"],
  ["Abrasion", "50,000 Martindale"],
  ["Finish", "Brushed after weaving"],
  ["Lining", "Pile sherpa"],
  ["Trim", "Guarda Pampa ribbon, 1 in"],
  ["Closure", "Internal elastic, no hardware"],
  ["Run", "Varies, dependent on harvest"],
] as const;

export const SIZE_OPTION = "Size";

export const materials = [
  ["Cloth", "Handwoven in Argentina on wooden looms"],
  ["Lining", "Pile sherpa"],
  ["Trim", "Guarda Pampa ribbon, 1 in"],
  ["Closure", "Internal elastic, no hardware"],
  ["Run", "Edition of five per cut — 3 driver, 2 fairway wood"],
] as const;

export function sizeOf(variant: { title: string; selectedOptions: { name: string; value: string }[] }) {
  return variant.selectedOptions.find((o) => o.name === SIZE_OPTION)?.value ?? variant.title;
}

export function editionSizeFor(size: string): number | undefined {
  if (size === "Driver") return site.edition.driver;
  if (size === "Fairway Wood") return site.edition.fairway;
  return undefined;
}

/**
 * Every cover is sold on pre-order: a run is made once all five covers in it are reserved.
 * Shared copy for the product page, shipping page and cart.
 */
export const preorder = {
  /** Production starts on this date at the latest, whether or not every run has filled. */
  deadline: "November 30",
  steps: [
    ["Reserve", "Pre-order now to claim one of the five covers in this run. You pay today."],
    [
      "Production begins",
      "As soon as all five are reserved — and by November 30 at the latest, full or not — the cloth is cut and every cover is made by hand.",
    ],
    ["It ships", "Most orders arrive in about 3–4 weeks. We'll email you when your run goes into production."],
  ],
} as const;

/** How many of a design's edition (3 driver + 2 fairway) have been reserved, from remaining stock. */
export function editionProgress(variants: { quantityAvailable: number | null }[]) {
  const total = site.edition.driver + site.edition.fairway;
  if (variants.some((v) => v.quantityAvailable === null)) return null;
  const left = variants.reduce((n, v) => n + Math.max(v.quantityAvailable ?? 0, 0), 0);
  return { total, reserved: Math.min(Math.max(total - left, 0), total) };
}
