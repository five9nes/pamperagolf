import "server-only";
import { get, list, put } from "@vercel/blob";

/*
 * Monitoring helpers: push notifications to ntfy and a little JSON history kept in a
 * private Vercel Blob store (production only). See docs/MONITORING.md.
 */

// ── Notifications ─────────────────────────────────────────────────────────────

export type Notice = {
  title: string;
  message: string;
  /** ntfy priority: 1 min · 2 low · 3 default · 4 high · 5 urgent. */
  priority?: 1 | 2 | 3 | 4 | 5;
  /** ntfy tags; names like "rotating_light" show as emoji. */
  tags?: string[];
  /** Opened when the notification is tapped. */
  click?: string;
};

/** Sends a push to the ntfy topic. Returns false when ntfy isn't configured. */
export async function notify(notice: Notice): Promise<boolean> {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) {
    console.warn("[monitor] NTFY_TOPIC not set; skipped:", notice.title);
    return false;
  }
  const token = process.env.NTFY_TOKEN;
  // JSON publishing keeps accents (Caldén, Ñandú) intact; header publishing is ASCII-only.
  const res = await fetch(process.env.NTFY_SERVER || "https://ntfy.sh", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ topic, ...notice }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`ntfy ${res.status}: ${await res.text()}`);
  return true;
}

// ── History ───────────────────────────────────────────────────────────────────

export async function readJson<T>(pathname: string): Promise<T | null> {
  const result = await get(pathname, { access: "private", useCache: false }).catch(() => null);
  if (!result || result.statusCode !== 200) return null;
  return (await new Response(result.stream).json()) as T;
}

export async function writeJson(pathname: string, data: unknown) {
  await put(pathname, JSON.stringify(data), {
    access: "private",
    allowOverwrite: true,
    addRandomSuffix: false,
    contentType: "application/json",
  });
}

export async function listJson<T>(prefix: string): Promise<T[]> {
  const { blobs } = await list({ prefix, limit: 1000 });
  const items = await Promise.all(blobs.map((b) => readJson<T>(b.pathname)));
  return items.filter((x) => x !== null) as T[];
}

/** Check status carried between runs, used to alert once and to send "back up". */
export type CheckState = { ok: boolean; since: string; alerted: boolean };
export type State = { checks: Record<string, CheckState> };
export const STATE_PATH = "monitor/state.json";

/** One day of check results (New York date). */
export type DayStats = {
  site: { total: number; ok: number; latencies: number[] };
  checkout: { total: number; ok: number };
};
export const dayPath = (date: string) => `monitor/days/${date}.json`;
export const emptyDay = (): DayStats => ({ site: { total: 0, ok: 0, latencies: [] }, checkout: { total: 0, ok: 0 } });

export type OrderRecord = { id: number; name: string; total: number; currency: string; items: number; at: string };
export const orderPath = (date: string, id: number) => `monitor/orders/${date}/${id}.json`;

// ── Misc ──────────────────────────────────────────────────────────────────────

/** YYYY-MM-DD in New York, where the business runs. */
export const nyDate = (d = new Date()) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(d);

/** Vercel Cron sends `Authorization: Bearer $CRON_SECRET`; anything else is refused. */
export function isCron(request: Request) {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && request.headers.get("authorization") === `Bearer ${secret}`;
}

export function formatDuration(ms: number) {
  const min = Math.round(ms / 60_000);
  if (min < 60) return `${Math.max(min, 1)} min`;
  const h = Math.floor(min / 60);
  return `${h} h ${min % 60} min`;
}

export const usd = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
