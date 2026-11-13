import { commerce } from "@/lib/commerce";
import {
  type CheckState,
  type DayStats,
  STATE_PATH,
  type State,
  dayPath,
  emptyDay,
  formatDuration,
  isCron,
  notify,
  nyDate,
  readJson,
  writeJson,
} from "@/lib/monitor";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** A page counts as up when it returns 200 within this time. */
const SLOW_MS = 3000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Result = { ok: boolean; detail: string };

async function probe(path: string) {
  const started = Date.now();
  try {
    const res = await fetch(site.url + path, {
      cache: "no-store",
      headers: { "User-Agent": "pamperagolf-monitor" },
      signal: AbortSignal.timeout(10_000),
    });
    await res.arrayBuffer();
    const ms = Date.now() - started;
    return { path, ms, ok: res.ok && ms < SLOW_MS, note: res.ok ? `${ms} ms` : `HTTP ${res.status}` };
  } catch (error) {
    return { path, ms: Date.now() - started, ok: false, note: error instanceof Error ? error.name : "failed" };
  }
}

/** Home, shop and the first product page. A failed page is retried once before it counts. */
async function checkSite(): Promise<Result & { latencies: number[] }> {
  const first = (await commerce.getCollectionProducts().catch(() => []))[0]?.handle ?? "lapacho";
  const paths = ["/", "/shop", `/products/${first}`];
  let results = await Promise.all(paths.map(probe));
  if (results.some((r) => !r.ok)) {
    await sleep(5000);
    results = await Promise.all(results.map((r) => (r.ok ? r : probe(r.path))));
  }
  return {
    ok: results.every((r) => r.ok),
    latencies: results.map((r) => r.ms),
    detail: results.map((r) => `${r.path} ${r.ok ? "ok" : "FAILED"} (${r.note}${r.ok || r.ms < SLOW_MS ? "" : `, ${r.ms} ms`})`).join("\n"),
  };
}

/*
 * Creates a real cart through the Storefront API (as the Pre-order button does) and
 * confirms the shop isn't behind its password page, which blocks checkout. It doesn't
 * open the checkout itself, so Shopify's analytics don't fill with test sessions.
 */
async function checkCheckout(): Promise<Result | null> {
  const attempt = async (): Promise<Result | null> => {
    try {
      const products = await commerce.getCollectionProducts();
      const variant = products.flatMap((p) => p.variants).find((v) => v.availableForSale);
      if (!variant) return null; // Everything reserved: nothing to test.
      const cart = await commerce.createCart([{ merchandiseId: variant.id, quantity: 1 }]);
      if (!cart.checkoutUrl) return { ok: false, detail: "Cart created but Shopify returned no checkout link." };
      const shop = await fetch(new URL("/", cart.checkoutUrl), {
        redirect: "manual",
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      });
      if ((shop.headers.get("location") ?? "").includes("/password")) {
        return { ok: false, detail: "The Shopify store is password-protected, so checkout shows “Opening soon”." };
      }
      return { ok: true, detail: "Cart and checkout link created." };
    } catch (error) {
      return { ok: false, detail: `Couldn't create a cart: ${error instanceof Error ? error.message : error}`.slice(0, 300) };
    }
  };
  const result = await attempt();
  if (result && !result.ok) {
    await sleep(5000);
    return attempt();
  }
  return result;
}

/** Alerts once when a check goes down and once when it comes back. */
async function track(state: State, key: string, label: string, result: Result, now: Date) {
  const prev: CheckState = state.checks[key] ?? { ok: true, since: now.toISOString(), alerted: false };
  const next = { ...prev };
  if (!result.ok) {
    if (prev.ok) Object.assign(next, { ok: false, since: now.toISOString(), alerted: false });
    if (!next.alerted) {
      next.alerted = await notify({
        title: `${label} is down`,
        message: result.detail,
        priority: 5,
        tags: ["rotating_light"],
        click: key === "checkout" ? "https://admin.shopify.com" : site.url,
      }).catch(() => false);
    }
  } else if (!prev.ok) {
    if (prev.alerted) {
      await notify({
        title: `${label} is back up`,
        message: `It was down for about ${formatDuration(now.getTime() - Date.parse(prev.since))}.`,
        priority: 3,
        tags: ["white_check_mark"],
      }).catch(() => {});
    }
    Object.assign(next, { ok: true, since: now.toISOString(), alerted: false });
  }
  state.checks[key] = next;
}

export async function GET(request: Request) {
  if (!isCron(request)) return new Response("Unauthorized", { status: 401 });

  if (new URL(request.url).searchParams.has("test")) {
    await notify({
      title: "Pampera monitoring is connected",
      message: "You'll get alerts here if the site or checkout goes down, a push for every order, and a 9am daily summary.",
      tags: ["golf"],
      click: site.url,
    });
    return Response.json({ sent: true });
  }

  const now = new Date();
  const runCheckout = now.getUTCMinutes() % 15 < 5;
  const [siteResult, checkoutResult] = await Promise.all([checkSite(), runCheckout ? checkCheckout() : null]);

  const state = (await readJson<State>(STATE_PATH)) ?? { checks: {} };
  await track(state, "site", "pamperagolf.com", siteResult, now);
  if (checkoutResult) await track(state, "checkout", "Checkout", checkoutResult, now);

  const date = nyDate(now);
  const day = (await readJson<DayStats>(dayPath(date))) ?? emptyDay();
  day.site.total++;
  if (siteResult.ok) day.site.ok++;
  day.site.latencies.push(Math.max(...siteResult.latencies));
  if (checkoutResult) {
    day.checkout.total++;
    if (checkoutResult.ok) day.checkout.ok++;
  }

  await Promise.all([writeJson(STATE_PATH, state), writeJson(dayPath(date), day)]);
  return Response.json({ site: siteResult, checkout: checkoutResult });
}
