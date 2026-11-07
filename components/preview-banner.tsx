export const PREVIEW_NOTE = "Preview — checkout opens once Shopify is connected.";

/** Desktop only; on small screens the same note sits in the footer, clear of the sticky cart bar. */
export function PreviewBanner() {
  return (
    <p className="label fixed bottom-4 left-4 z-30 hidden max-w-xs rounded-2xl bg-coral px-3.5 py-2 text-[10px] text-ink shadow-[0_8px_30px_rgb(0_0_0/0.12)] md:block">
      {PREVIEW_NOTE}
    </p>
  );
}
