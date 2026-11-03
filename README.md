# pamperagolf.com

Storefront for Pampera — handwoven Argentine headcovers. Next.js on Vercel, with Shopify
(Storefront API) for products, stock, cart and checkout.

## Develop

```bash
npm install
cp .env.example .env.local   # leave Shopify keys empty to use the preview catalog
npm run dev
```

Without Shopify credentials the site uses `lib/commerce/preview-catalog.ts`
(placeholder names, prices and stock) and checkout is disabled.
See [docs/SHOPIFY_SETUP.md](docs/SHOPIFY_SETUP.md) to connect the real store.

## Layout

| Path | What |
| --- | --- |
| `app/` | Pages: home, `/shop`, `/products/[handle]`, `/story`, `/shipping` |
| `app/api/revalidate` | Shopify webhook → refreshes cached product data |
| `lib/commerce/` | Shopify client + preview provider behind one interface |
| `lib/cart-actions.ts` | Server actions for the cart (cart id kept in a cookie) |
| `lib/site.ts` | Brand copy, edition sizes (3 driver / 2 fairway), size guide |
| `components/` | Header, footer, cart drawer, product UI, logo |
| `public/images/` | Marine Park shoot, converted to sRGB and resized |

Brand palette and type tokens live in `app/globals.css`.
