# Connecting Shopify

The site runs on a built-in preview catalog until these steps are done. Shopify holds
products, stock, orders, tax and checkout; this site (on Vercel) is the storefront.

## 1. Store basics
1. Create the store on the **Basic** plan. Store currency: **USD**.
2. **Settings → Markets**: United States only.
3. **Settings → Payments**: activate Shopify Payments (enables Shop Pay, Apple Pay, cards).
4. **Settings → Taxes and duties**: turn on Shopify Tax and collect in the states where you have nexus
   (at minimum, the state you ship from).
5. **Settings → Policies**: write refund, shipping and contact policies. Checkout links to these;
   keep `/shipping` on the site consistent with them.

## 2. Headless channel + API token
1. Install the **Headless** sales channel from the Shopify App Store and create a storefront.
2. Under **Storefront API → Manage permissions**, make sure these are on:
   - Read products, variants and collections
   - **Read product inventory** — required for the "2 of 3 left" counts
   - Read and modify carts
3. Copy the **public access token**.

## 3. Products — import the CSV
`docs/shopify-products.csv` holds all six designs: names, stories, subtitles, `Size` option
(`Driver` / `Fairway Wood`), prices ($110 / $100), stock (3 / 2, no overselling), SKUs and
photos (Shopify downloads them from the live site). Regenerate it after catalog changes with
`node scripts/shopify-products-csv.ts`.

1. **Settings → Custom data → Products → Add definition**: name `Subtitle`, namespace and key
   `custom.subtitle`, type *Single line text*, **Storefronts access on**. Do this *before* the
   import so the subtitle column lands.
2. **Products → Import**, choose the CSV, import. Check the six products appear with 2
   variants and 3–5 photos each.
3. Select all six → **More actions → Include in sales channels → Headless**.

The option name and values must stay exactly `Size`, `Driver`, `Fairway Wood` — the size guide
and the "of 3" / "of 2" edition counts key off them.

## 4. Collection
**Products → Collections → Create**: title **Las Pampas**, type *Manual*, add the six products,
sort *Manually* in this order — Lapacho, Caldén, Trigal, Ñandú, Estancia, Amanecer — and make it
available on **Headless**. Under *Search engine listing*, set the URL handle to **`las-pampas`**.

## 5. Shipping
**Settings → Shipping and delivery**: set the ship-from location (New York or Miami). Ship to the
**United States only**, with a single **Free shipping** rate ($0) — the site promises free US shipping. Add the lead time ("ships in 2–3 weeks") to the order confirmation email under
**Settings → Notifications**.

## 6. Checkout domain
Checkout runs on Shopify. To keep it on your domain, add a subdomain such as
`shop.pamperagolf.com` under **Settings → Domains** (CNAME to `shops.myshopify.com`) and
make it primary. `pamperagolf.com` itself stays pointed at Vercel.

## 7. Vercel environment variables
Project → Settings → Environment Variables (Production and Preview):

| Key | Value |
| --- | --- |
| `SHOPIFY_STORE_DOMAIN` | `your-store.myshopify.com` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | token from step 2 |
| `SHOPIFY_COLLECTION_HANDLE` | `las-pampas` |
| `SHOPIFY_WEBHOOK_SECRET` | from step 8 |
| `NEXT_PUBLIC_SITE_URL` | `https://www.pamperagolf.com` |

Redeploy. The coral preview note disappears once Shopify is connected.

## 8. Webhooks (instant stock updates)
Product pages cache for up to 5 minutes. To refresh immediately after a sale or edit:
**Settings → Notifications → Webhooks**, add JSON webhooks pointing to
`https://www.pamperagolf.com/api/revalidate` (use `www`: the bare domain redirects, and webhooks don't follow redirects) for:
`products/create`, `products/update`, `products/delete`, `collections/update`,
`inventory_levels/update`. Copy the signing secret shown on that page into
`SHOPIFY_WEBHOOK_SECRET`.
