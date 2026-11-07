import "server-only";
import { previewProvider } from "./preview";
import { createShopifyProvider } from "./shopify";
import type { CommerceProvider } from "./types";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

/** Shopify when credentials are configured, otherwise the built-in preview catalog. */
export const commerce: CommerceProvider =
  domain && token
    ? createShopifyProvider({
        domain,
        token,
        collectionHandle: process.env.SHOPIFY_COLLECTION_HANDLE || "las-pampas",
      })
    : previewProvider;

export type * from "./types";
