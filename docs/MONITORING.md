# Monitoring

Alerts go to the ntfy topic in `NTFY_TOPIC` (on `NTFY_SERVER`, default https://ntfy.sh;
`NTFY_TOKEN` if the topic is protected). Everything runs in production only.

| What | How | Alert |
|---|---|---|
| Site up | `/api/monitor/check` every 5 min (Vercel Cron): home, shop, first product page must return 200 in < 3 s; failures are retried once | Urgent push when down, normal push when back up |
| Checkout works | Same route every 15 min: creates a cart via the Storefront API and checks the Shopify store isn't password-protected | Urgent push when down, normal push when back up |
| New orders | Shopify "Order creation" webhook → `/api/revalidate` | High-priority push per order (order number, items, total; no customer details) |
| Daily summary | `/api/monitor/digest` at 14:00 UTC (9am New York in winter, 10am in summer) | Low-priority push: orders, revenue, uptime, load times |
| Traffic | Vercel Web Analytics; custom events `Pre-order` and `Checkout` | Dashboard only |

History (check state, per-day stats, orders) is kept as JSON in the private Blob store
`pamperagolf-monitor` under `monitor/`.

## Setup

- Vercel env (production): `NTFY_TOPIC`, `CRON_SECRET`, `BLOB_READ_WRITE_TOKEN` (added by the Blob store link).
- Vercel → pamperagolf → Analytics → Enable Web Analytics.
- Shopify Admin → Settings → Notifications → Webhooks → Create webhook: event "Order creation",
  JSON, URL `https://www.pamperagolf.com/api/revalidate`.

## Manual runs

```sh
curl -H "Authorization: Bearer $CRON_SECRET" "https://www.pamperagolf.com/api/monitor/check?test"   # test push
curl -H "Authorization: Bearer $CRON_SECRET" https://www.pamperagolf.com/api/monitor/check          # run checks
curl -H "Authorization: Bearer $CRON_SECRET" https://www.pamperagolf.com/api/monitor/digest         # send summary
```
