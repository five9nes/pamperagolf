import type { Image, Product, Variant } from "./types";

/*
 * Preview catalog used when Shopify isn't connected yet.
 * Las Pampas is six designs, each in driver and fairway wood, in the order of the
 * La Pampa Colección sheet (Caldén, Trigal and Ñandú form the La Guarda family).
 * Names and stories are from that sheet; prices are PLACEHOLDERS until the real
 * catalog lives in Shopify.
 */

const PRICE = { Driver: "185.00", "Fairway Wood": "165.00" } as const;

type Seed = {
  handle: string;
  title: string;
  subtitle: string;
  description: string;
  images: [frame: string, w: number, h: number, alt: string][];
  stock: { Driver: number; "Fairway Wood": number };
};

const seeds: Seed[] = [
  {
    handle: "lapacho",
    title: "Lapacho",
    subtitle: "Pink · lilac · cream bouclé",
    description:
      "Named for the lapacho rosado, the tree that blooms bright pink across Argentina in late winter. A looped bouclé in pink, lilac and cream.",
    images: [
      ["01", 1600, 2000, "Lapacho headcover in a pink, lilac and cream bouclé"],
      ["02", 1200, 1501, "Close-up of the Lapacho bouclé"],
      ["03", 1600, 2000, "Inside the Lapacho cover: pile sherpa lining and Guarda Pampa band"],
      ["04", 1600, 2400, "Two bags dressed in Pampera covers against a stone wall above the course"],
    ],
    stock: { Driver: 3, "Fairway Wood": 2 },
  },
  {
    handle: "calden",
    title: "Caldén",
    subtitle: "Rust · cream geometric",
    description:
      "Named for the caldén, the signature tree of La Pampa province, with reddish wood and deep roots. A rust lattice woven over undyed cream — the anchor piece of the collection.",
    images: [
      ["01", 1600, 2000, "Caldén headcover in a rust and cream geometric weave"],
      ["02", 1200, 1500, "Close-up of the Caldén weave"],
      ["03", 1600, 2400, "Caldén, Ñandú and Amanecer covers lying on the grass with a golf bag"],
    ],
    stock: { Driver: 3, "Fairway Wood": 2 },
  },
  {
    handle: "trigal",
    title: "Trigal",
    subtitle: "Ochre · cream geometric",
    description:
      "Wheat field. The golden Pampas at harvest, in an ochre lattice woven over undyed cream.",
    images: [
      ["01", 1600, 2000, "Trigal headcover in an ochre and cream geometric weave"],
      ["02", 1200, 1501, "Close-up of the Trigal weave"],
      ["03", 1600, 2000, "Inside the Trigal cover: pile sherpa lining"],
    ],
    stock: { Driver: 3, "Fairway Wood": 2 },
  },
  {
    handle: "nandu",
    title: "Ñandú",
    subtitle: "Charcoal · cream geometric",
    description:
      "The grey rhea of the Pampas, echoing the ñandú footprint on the woven tag. A charcoal lattice over undyed cream — a quiet signature piece.",
    images: [
      ["01", 1600, 2000, "Ñandú headcover in a charcoal and cream geometric weave"],
      ["02", 1200, 1501, "Close-up of the Ñandú weave"],
      ["03", 1600, 2000, "Inside the Ñandú cover: pile sherpa lining and Guarda Pampa band"],
      ["04", 1600, 2400, "Two bags dressed in Pampera covers against a stone wall above the course"],
    ],
    stock: { Driver: 3, "Fairway Wood": 2 },
  },
  {
    handle: "estancia",
    title: "Estancia",
    subtitle: "Burgundy · forest green plaid, tee band",
    description:
      "The ranch house. Heritage tweed in burgundy and forest green, banded with Guarda Pampa ribbon that holds your tees where you can reach them.",
    images: [
      ["01", 1600, 2000, "Estancia headcover in burgundy and forest green plaid with tees in its band"],
      ["02", 1200, 1501, "Close-up of the Estancia tweed and Guarda Pampa tee band"],
      ["03", 1600, 2000, "Estancia headcover from the back, showing the woven Pampera label"],
      ["04", 1600, 2000, "Inside the Estancia cover: pile sherpa lining"],
      ["05", 1600, 2400, "Estancia and Amanecer covers on a stand bag leaning on a stone pillar"],
    ],
    stock: { Driver: 3, "Fairway Wood": 2 },
  },
  {
    handle: "amanecer",
    title: "Amanecer",
    subtitle: "Grey · coral · cream plaid",
    description: "Sunrise. Soft coral light over a grey morning, in a plaid of grey, coral and cream.",
    images: [
      ["01", 1600, 2000, "Amanecer headcover in a grey, coral and cream plaid"],
      ["02", 1200, 1501, "Close-up of the Amanecer plaid"],
      ["03", 1600, 2000, "Inside the Amanecer cover: pile sherpa lining and Guarda Pampa band"],
      ["04", 1600, 2400, "A golfer carries his bag with the Amanecer cover under his arm"],
    ],
    stock: { Driver: 3, "Fairway Wood": 2 },
  },
];

const money = (amount: string) => ({ amount, currencyCode: "USD" });

function toProduct(seed: Seed, index: number): Product {
  const images: Image[] = seed.images.map(([frame, width, height, alt]) => ({
    url: `/images/products/${seed.handle}/${frame}.jpg`,
    altText: alt,
    width,
    height,
  }));
  const variants: Variant[] = (["Driver", "Fairway Wood"] as const).map((size) => ({
    id: `preview-variant:${seed.handle}:${size === "Driver" ? "driver" : "fairway"}`,
    title: size,
    availableForSale: seed.stock[size] > 0,
    quantityAvailable: seed.stock[size],
    price: money(PRICE[size]),
    selectedOptions: [{ name: "Size", value: size }],
  }));
  return {
    id: `preview-product:${index}`,
    handle: seed.handle,
    title: seed.title,
    subtitle: seed.subtitle,
    description: seed.description,
    descriptionHtml: `<p>${seed.description}</p>`,
    availableForSale: variants.some((v) => v.availableForSale),
    priceRange: { minVariantPrice: money(PRICE["Fairway Wood"]), maxVariantPrice: money(PRICE.Driver) },
    images,
    variants,
    seo: { title: null, description: null },
  };
}

export const previewProducts: Product[] = seeds.map(toProduct);
