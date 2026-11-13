import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { after } from "next/server";
import { PRODUCTS_TAG } from "@/lib/commerce/shopify";
import { type OrderRecord, notify, nyDate, orderPath, readJson, usd, writeJson } from "@/lib/monitor";

/*
 * Shopify webhook target. Point the product, collection and inventory webhooks here
 * (see docs/SHOPIFY_SETUP.md) so a sale or a stock change shows on the site right away
 * instead of waiting for the 5-minute cache to lapse.
 *
 * The "Order creation" webhook also lands here: it sends a push to ntfy and records the
 * order for the daily summary.
 */

type ShopifyOrder = {
  id: number;
  name: string;
  created_at: string;
  total_price: string;
  currency: string;
  line_items: { title: string; variant_title: string | null; quantity: number }[];
};

async function handleOrder(order: ShopifyOrder) {
  const at = new Date(order.created_at || Date.now());
  const path = orderPath(nyDate(at), order.id);
  if (await readJson(path)) return; // Shopify retried a webhook we already handled.
  const record: OrderRecord = {
    id: order.id,
    name: order.name,
    total: Number(order.total_price),
    currency: order.currency,
    items: order.line_items.reduce((n, l) => n + l.quantity, 0),
    at: at.toISOString(),
  };
  await writeJson(path, record);
  // No customer details: the ntfy topic is readable by anyone who knows its name.
  await notify({
    title: `New pre-order ${order.name} · ${usd(record.total, record.currency)}`,
    message: order.line_items
      .map((l) => `${l.quantity} × ${l.title}${l.variant_title ? ` (${l.variant_title})` : ""}`)
      .join("\n"),
    priority: 4,
    tags: ["tada"],
    click: `https://admin.shopify.com/store/${(process.env.SHOPIFY_STORE_DOMAIN ?? "").split(".")[0]}/orders/${order.id}`,
  });
}
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

  const topic = request.headers.get("x-shopify-topic");
  if (topic === "orders/create") {
    // Reply to Shopify straight away; the push and record happen after the response.
    after(() => handleOrder(JSON.parse(body) as ShopifyOrder).catch((e) => console.error("[monitor] order", e)));
  }
  return Response.json({ revalidated: true, topic });
}
