import type { Image, Product, Variant } from "./types";

/*
 * Preview catalog used when Shopify isn't connected yet.
 * Names, copy and prices are PLACEHOLDERS — the real catalog lives in Shopify.
 * Stock follows the edition model (3 driver, 2 fairway wood); a few variants are
 * pre-sold so the low-stock and sold-out states can be seen.
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
    handle: "mustard-diamond",
    title: "Mustard Diamond",
    subtitle: "Ochre lattice on undyed cream",
    description:
      "Stacked diamonds in a deep ochre, woven tight over an undyed cream ground. The colour of the pampas in late summer, when the grass has turned and the light comes in low.",
    images: [
      ["01", 1280, 1600, "Mustard diamond headcover laid flat on grass"],
      ["02", 1280, 1600, "Mustard diamond headcover, angled view"],
      ["03", 1067, 1600, "Mustard, rust and slate diamond covers lying beside a golf bag"],
    ],
    stock: { Driver: 3, "Fairway Wood": 2 },
  },
  {
    handle: "sage-diamond",
    title: "Sage Diamond",
    subtitle: "Slate-sage lattice on undyed cream",
    description:
      "The same lattice as the Mustard, read in a cool sage that shifts toward slate under cloud. Quiet in the bag, unmistakable up close.",
    images: [
      ["01", 1280, 1600, "Sage diamond headcover laid flat on grass"],
      ["02", 1600, 1067, "Sage diamond cover on a driver beside a navy golf bag"],
      ["03", 1067, 1600, "Sage, rust and mustard diamond covers on the fairway"],
    ],
    stock: { Driver: 2, "Fairway Wood": 2 },
  },
  {
    handle: "coral-diamond",
    title: "Coral Diamond",
    subtitle: "Rust-coral lattice on undyed cream",
    description:
      "Our lattice in the warmest thread we have — a rust coral close to the brand mark itself. Sunbaked clay rather than signal orange.",
    images: [
      ["01", 1067, 1600, "Coral and slate diamond covers in a golf bag on a cart"],
      ["02", 1067, 1600, "Coral diamond cover beside slate and mustard covers on grass"],
    ],
    stock: { Driver: 1, "Fairway Wood": 2 },
  },
  {
    handle: "navy-plaid",
    title: "Navy Plaid",
    subtitle: "Flecked navy check with Guarda Pampa band",
    description:
      "A brushed, flecked navy check crossed with moss and straw lines, banded with Guarda Pampa ribbon that holds three tees where you can reach them.",
    images: [
      ["01", 1280, 1600, "Navy plaid headcover with tees in its band, laid flat on grass"],
      ["02", 1067, 1600, "Close-up of the navy plaid cloth and Guarda Pampa tee band"],
      ["03", 1067, 1600, "Navy plaid cover showing the woven Pampera label"],
    ],
    stock: { Driver: 3, "Fairway Wood": 0 },
  },
  {
    handle: "rose-tweed",
    title: "Rose Tweed",
    subtitle: "Rose, wine and grey basket weave",
    description:
      "A loose basket weave in rose, wine and stone grey. Soft to the hand, with the irregular colour that only natural dye gives — no two lengths match.",
    images: [
      ["01", 1280, 1600, "Rose tweed headcover laid flat on grass"],
      ["02", 1280, 1600, "Rose tweed headcover, second view"],
      ["03", 1067, 1600, "Close-up of the rose tweed weave beside plaid and crochet covers"],
    ],
    stock: { Driver: 3, "Fairway Wood": 2 },
  },
  {
    handle: "crochet-patchwork",
    title: "Crochet Patchwork",
    subtitle: "Granny squares in sage, cream and clay",
    description:
      "Hand-crocheted squares in sage and cream, framed in clay and finished with a cocoa rib. The most hand-worked cover in the collection.",
    images: [
      ["01", 1280, 1600, "Crochet patchwork headcover laid flat on grass"],
      ["02", 1067, 1600, "Close-up of the crochet squares and Pampera label"],
      ["03", 1067, 1600, "Crochet, rose tweed and navy plaid covers in a golf bag"],
    ],
    stock: { Driver: 2, "Fairway Wood": 1 },
  },
  {
    handle: "leather-check",
    title: "Leather & Check",
    subtitle: "Tan leather crown over terracotta check",
    description:
      "A tan leather crown over a terracotta and cream check. The leather takes the wear at the top; the cloth carries the colour below.",
    images: [
      ["01", 1280, 1600, "Leather and terracotta check headcover laid flat on grass"],
      ["02", 1067, 1600, "Leather and check cover beside the crochet patchwork cover"],
      ["03", 1067, 1600, "Leather and check cover in a stand bag near the green"],
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
