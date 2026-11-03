import "server-only";
import type { Cart, CommerceProvider, Image, Money, Product, SelectedOption } from "./types";

const API_VERSION = "2026-07";
export const PRODUCTS_TAG = "products";

const imageFields = "url altText width height";
const moneyFields = "amount currencyCode";

const productFragment = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    availableForSale
    subtitle: metafield(namespace: "custom", key: "subtitle") { value }
    priceRange {
      minVariantPrice { ${moneyFields} }
      maxVariantPrice { ${moneyFields} }
    }
    images(first: 12) { nodes { ${imageFields} } }
    variants(first: 10) {
      nodes {
        id
        title
        availableForSale
        quantityAvailable
        price { ${moneyFields} }
        selectedOptions { name value }
      }
    }
    seo { title description }
  }
`;

const cartFragment = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost { subtotalAmount { ${moneyFields} } }
    lines(first: 50) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            quantityAvailable
            price { ${moneyFields} }
            product { handle title featuredImage { ${imageFields} } }
          }
        }
      }
    }
  }
`;

type ShopifyProduct = Omit<Product, "subtitle" | "images" | "variants"> & {
  subtitle: { value: string } | null;
  images: { nodes: Image[] };
  variants: {
    nodes: {
      id: string;
      title: string;
      availableForSale: boolean;
      quantityAvailable: number | null;
      price: Money;
      selectedOptions: SelectedOption[];
    }[];
  };
};

type ShopifyCart = Omit<Cart, "subtotal" | "lines"> & {
  cost: { subtotalAmount: Money };
  lines: { nodes: Cart["lines"] };
};

type UserError = { field: string[] | null; message: string };

export class ShopifyError extends Error {}

function reshapeProduct(p: ShopifyProduct): Product {
  return {
    ...p,
    subtitle: p.subtitle?.value ?? null,
    images: p.images.nodes,
    variants: p.variants.nodes,
  };
}

function reshapeCart(c: ShopifyCart): Cart {
  return {
    id: c.id,
    checkoutUrl: c.checkoutUrl,
    totalQuantity: c.totalQuantity,
    subtotal: c.cost.subtotalAmount,
    lines: c.lines.nodes,
  };
}

export function createShopifyProvider(opts: {
  domain: string;
  token: string;
  collectionHandle: string;
}): CommerceProvider {
  const endpoint = `https://${opts.domain.replace(/^https?:\/\//, "")}/api/${API_VERSION}/graphql.json`;

  async function storefront<T>(
    query: string,
    variables: Record<string, unknown> = {},
    cache: "products" | "no-store" = "no-store",
  ): Promise<T> {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": opts.token,
      },
      body: JSON.stringify({ query, variables }),
      ...(cache === "products"
        ? { cache: "force-cache", next: { tags: [PRODUCTS_TAG], revalidate: 300 } }
        : { cache: "no-store" }),
    });
    if (!res.ok) {
      throw new ShopifyError(`Shopify Storefront API ${res.status}: ${await res.text()}`);
    }
    const body = (await res.json()) as { data?: T; errors?: { message: string }[] };
    if (body.errors?.length) {
      throw new ShopifyError(body.errors.map((e) => e.message).join("; "));
    }
    return body.data as T;
  }

  async function cartMutation(
    name: "cartCreate" | "cartLinesAdd" | "cartLinesUpdate" | "cartLinesRemove",
    signature: string,
    args: string,
    variables: Record<string, unknown>,
  ): Promise<Cart> {
    const data = await storefront<
      Record<string, { cart: ShopifyCart | null; userErrors: UserError[] }>
    >(
      `mutation ${name}(${signature}) {
        ${name}(${args}) { cart { ...CartFields } userErrors { field message } }
      }
      ${cartFragment}`,
      variables,
    );
    const { cart, userErrors } = data[name];
    if (userErrors.length || !cart) {
      throw new ShopifyError(userErrors.map((e) => e.message).join("; ") || "Cart update failed");
    }
    return reshapeCart(cart);
  }

  return {
    mode: "shopify",

    async getCollectionProducts() {
      const data = await storefront<{
        collection: { products: { nodes: ShopifyProduct[] } } | null;
      }>(
        `query CollectionProducts($handle: String!) {
          collection(handle: $handle) {
            products(first: 50, sortKey: COLLECTION_DEFAULT) { nodes { ...ProductFields } }
          }
        }
        ${productFragment}`,
        { handle: opts.collectionHandle },
        "products",
      );
      if (!data.collection) {
        throw new ShopifyError(`Collection "${opts.collectionHandle}" not found in Shopify`);
      }
      return data.collection.products.nodes.map(reshapeProduct);
    },

    async getProduct(handle) {
      const data = await storefront<{ product: ShopifyProduct | null }>(
        `query Product($handle: String!) {
          product(handle: $handle) { ...ProductFields }
        }
        ${productFragment}`,
        { handle },
        "products",
      );
      return data.product ? reshapeProduct(data.product) : undefined;
    },

    async getCart(cartId) {
      const data = await storefront<{ cart: ShopifyCart | null }>(
        `query Cart($cartId: ID!) { cart(id: $cartId) { ...CartFields } }
        ${cartFragment}`,
        { cartId },
      );
      return data.cart ? reshapeCart(data.cart) : undefined;
    },

    createCart: (lines) =>
      cartMutation("cartCreate", "$lines: [CartLineInput!]", "input: { lines: $lines }", { lines }),

    addToCart: (cartId, lines) =>
      cartMutation(
        "cartLinesAdd",
        "$cartId: ID!, $lines: [CartLineInput!]!",
        "cartId: $cartId, lines: $lines",
        { cartId, lines },
      ),

    updateCart: (cartId, lines) =>
      cartMutation(
        "cartLinesUpdate",
        "$cartId: ID!, $lines: [CartLineUpdateInput!]!",
        "cartId: $cartId, lines: $lines",
        { cartId, lines },
      ),

    removeFromCart: (cartId, lineIds) =>
      cartMutation(
        "cartLinesRemove",
        "$cartId: ID!, $lineIds: [ID!]!",
        "cartId: $cartId, lineIds: $lineIds",
        { cartId, lineIds },
      ),
  };
}
