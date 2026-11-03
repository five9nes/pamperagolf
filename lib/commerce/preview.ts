import "server-only";
import { previewProducts } from "./preview-catalog";
import type { Cart, CartLine, CommerceProvider } from "./types";

/*
 * Stand-in provider used until Shopify credentials are set. The cart has no
 * server state: its lines are encoded in the cart id, which lives in a cookie.
 */

type StoredLine = { merchandiseId: string; quantity: number };

const variants = new Map(
  previewProducts.flatMap((product) => product.variants.map((variant) => [variant.id, { product, variant }])),
);

const encode = (lines: StoredLine[]) =>
  `preview-cart:${Buffer.from(JSON.stringify(lines)).toString("base64url")}`;

function decode(cartId: string): StoredLine[] {
  try {
    const raw = JSON.parse(Buffer.from(cartId.replace(/^preview-cart:/, ""), "base64url").toString());
    return Array.isArray(raw) ? raw.filter((l) => variants.has(l.merchandiseId) && l.quantity > 0) : [];
  } catch {
    return [];
  }
}

function toCart(stored: StoredLine[]): Cart {
  const lines: CartLine[] = stored.filter((l) => l.quantity > 0).map(({ merchandiseId, quantity }) => {
    const { product, variant } = variants.get(merchandiseId)!;
    return {
      id: merchandiseId,
      quantity: Math.min(quantity, variant.quantityAvailable ?? quantity),
      merchandise: {
        id: variant.id,
        title: variant.title,
        quantityAvailable: variant.quantityAvailable,
        price: variant.price,
        product: { handle: product.handle, title: product.title, featuredImage: product.images[0] ?? null },
      },
    };
  });
  const subtotal = lines.reduce((sum, l) => sum + Number(l.merchandise.price.amount) * l.quantity, 0);
  return {
    id: encode(lines.map((l) => ({ merchandiseId: l.merchandise.id, quantity: l.quantity }))),
    checkoutUrl: null,
    totalQuantity: lines.reduce((sum, l) => sum + l.quantity, 0),
    subtotal: { amount: subtotal.toFixed(2), currencyCode: "USD" },
    lines,
  };
}

function merge(stored: StoredLine[], added: StoredLine[]): StoredLine[] {
  const next = stored.map((l) => ({ ...l }));
  for (const line of added) {
    const existing = next.find((l) => l.merchandiseId === line.merchandiseId);
    if (existing) existing.quantity += line.quantity;
    else next.push({ ...line });
  }
  return next;
}

export const previewProvider: CommerceProvider = {
  mode: "preview",
  getCollectionProducts: async () => previewProducts,
  getProduct: async (handle) => previewProducts.find((p) => p.handle === handle),
  getCart: async (cartId) => toCart(decode(cartId)),
  createCart: async (lines) => toCart(merge([], lines)),
  addToCart: async (cartId, lines) => toCart(merge(decode(cartId), lines)),
  updateCart: async (cartId, lines) =>
    toCart(
      decode(cartId).map((l) => ({
        ...l,
        quantity: lines.find((u) => u.id === l.merchandiseId)?.quantity ?? l.quantity,
      })),
    ),
  removeFromCart: async (cartId, lineIds) =>
    toCart(decode(cartId).filter((l) => !lineIds.includes(l.merchandiseId))),
};
