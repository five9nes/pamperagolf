export const site = {
  name: "Pampera",
  tagline: "The loom before the links",
  description:
    "Golf headcovers cut from handwoven Argentine cloth and finished by hand. Made in editions of five — when the cloth is gone, the run is over.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pamperagolf.com",
  // TODO: add contact email once confirmed.
  instagram: { handle: "pamperagolf", url: "https://www.instagram.com/pamperagolf" },
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

/** From the brand book: the six stages each length of cloth goes through. */
export const processSteps = [
  ["The Flock", "Sheep in the south, alpaca in the north, in communities where the flock has been the family's living for as long as anyone can account for."],
  ["Spinning", "The fleece is sorted by hand, washed, and spun on a spindle — then spun a second time, two threads twisted into one."],
  ["Dyeing", "Colour comes from plants, flowers, vegetables, and smoke. Natural dye never lands evenly, so no two lengths of the same colour match."],
  ["The Loom", "The looms are wooden and the weavers built them. Each community weaves differently, and you can see the region in the cloth if you know what to look for."],
  ["Cutting", "Every length is catalogued: fibre, width, weave, weight, how much of it exists. That last number decides everything."],
  ["Finishing", "Cut to the pattern, lined in pile, banded with the Guarda Pampa, elasticated, labelled — and numbered."],
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
