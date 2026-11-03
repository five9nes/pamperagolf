import { readCart } from "@/lib/cart-actions";

export async function GET() {
  return Response.json({ cart: await readCart() }, { headers: { "Cache-Control": "no-store" } });
}
