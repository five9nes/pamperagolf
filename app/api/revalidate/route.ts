import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { PRODUCTS_TAG } from "@/lib/commerce/shopify";

/*
 * Shopify webhook target. Point the product, collection and inventory webhooks here
 * (see docs/SHOPIFY_SETUP.md) so a sale or a stock change shows on the site right away
 * instead of waiting for the 5-minute cache to lapse.
 */
export async function POST(request: Request) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhook secret not configured", { status: 500 });

  const body = await request.text();
  const signature = request.headers.get("x-shopify-hmac-sha256") ?? "";
  const expected = createHmac("sha256", secret).update(body, "utf8").digest();
  const received = Buffer.from(signature, "base64");
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    return new Response("Invalid signature", { status: 401 });
  }

  // Stock counts are shown on product pages, so stale data must not be served.
  revalidateTag(PRODUCTS_TAG, { expire: 0 });
  return Response.json({ revalidated: true, topic: request.headers.get("x-shopify-topic") });
}
