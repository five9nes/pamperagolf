import {
  type DayStats,
  type OrderRecord,
  dayPath,
  isCron,
  listJson,
  notify,
  nyDate,
  readJson,
  usd,
} from "@/lib/monitor";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ANALYTICS_URL = "https://vercel.com/akazmi-6257s-projects/pamperagolf/analytics";

const pct = (ok: number, total: number) => (total ? `${((ok / total) * 100).toFixed(ok === total ? 0 : 2)}%` : "no data");

function percentile(values: number[], p: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))];
}

/** Daily summary of yesterday (New York time), sent each morning by Vercel Cron. */
export async function GET(request: Request) {
  if (!isCron(request)) return new Response("Unauthorized", { status: 401 });

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const date = nyDate(yesterday);
  const [day, orders] = await Promise.all([
    readJson<DayStats>(dayPath(date)),
    listJson<OrderRecord>(`monitor/orders/${date}/`),
  ]);

  const revenue = orders.reduce((n, o) => n + o.total, 0);
  const covers = orders.reduce((n, o) => n + o.items, 0);
  const label = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(yesterday);

  const lines = [
    orders.length
      ? `Orders: ${orders.length} · ${usd(revenue, orders[0].currency)} · ${covers} cover${covers === 1 ? "" : "s"}`
      : "Orders: none",
    day
      ? `Site up: ${pct(day.site.ok, day.site.total)} · typical load ${percentile(day.site.latencies, 50)} ms, slowest ${percentile(day.site.latencies, 100)} ms`
      : "Site checks: no data",
    day ? `Checkout working: ${pct(day.checkout.ok, day.checkout.total)}` : null,
    "Tap for visitors and pre-order clicks.",
  ].filter(Boolean);

  await notify({
    title: `Pampera · ${label}`,
    message: lines.join("\n"),
    priority: 2,
    tags: ["bar_chart"],
    click: ANALYTICS_URL,
  });
  return Response.json({ date, lines });
}
