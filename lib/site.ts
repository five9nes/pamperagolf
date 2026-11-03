export const site = {
  name: "Pampera",
  tagline: "The loom before the links",
  description:
    "Golf headcovers cut from handwoven Argentine cloth and finished by hand. Made in editions of five — when the cloth is gone, the run is over.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://pamperagolf.com",
  // TODO: add contact email and Instagram once confirmed.
  collection: {
    title: "La Pampa",
    eyebrow: "The Founding Collection",
  },
  /** Every cut is released as one edition: 3 driver covers + 2 fairway wood covers. */
  edition: { driver: 3, fairway: 2 },
  leadTime: "Handmade to order — ships in 2–3 weeks",
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
