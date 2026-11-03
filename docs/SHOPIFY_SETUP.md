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

## 3. Products (one per design)
For each design in the La Pampa collection:
- **Title** = the design name. The URL handle becomes `/products/<handle>`.
- **Description** = the story of the cloth (shown on the product page).
- **Option** named exactly `Size` with values exactly `Driver` and `Fairway Wood`.
  The size guide and the "of 3"/"of 2" edition counts key off these names.
- **Inventory**: track quantity — Driver **3**, Fairway Wood **2**. Leave
  *Continue selling when out of stock* **off**; that is what prevents overselling.
- **Images**: upload from `Products/La Pampa/shopify-upload/` (already sRGB, 2400px).
  The first image is the grid image; flat lays on grass keep the grid consistent.
- **Subtitle** (optional): create a product metafield definition `custom.subtitle`
  (single line text) with **Storefronts access** enabled. Shown under the title.
- **Sales channels**: make sure the product is published to **Headless**.

## 4. Collection
Create a manual collection with handle **`la-pampa`**, add the products, set the sort order
(this is the order on the site), and publish it to **Headless**.

## 5. Shipping
**Settings → Shipping and delivery**: set the ship-from location (New York or Miami) and US
rates. Add the lead time ("ships in 2–3 weeks") to the order confirmation email under
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
| `SHOPIFY_COLLECTION_HANDLE` | `la-pampa` |
| `SHOPIFY_WEBHOOK_SECRET` | from step 8 |
| `NEXT_PUBLIC_SITE_URL` | `https://pamperagolf.com` |

Redeploy. The coral "preview catalog" banner disappears once Shopify is connected.

## 8. Webhooks (instant stock updates)
Product pages cache for up to 5 minutes. To refresh immediately after a sale or edit:
**Settings → Notifications → Webhooks**, add JSON webhooks pointing to
`https://pamperagolf.com/api/revalidate` for:
`products/create`, `products/update`, `products/delete`, `collections/update`,
`inventory_levels/update`. Copy the signing secret shown on that page into
`SHOPIFY_WEBHOOK_SECRET`.
