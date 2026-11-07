// Writes docs/shopify-products.csv from the preview catalog, for Shopify → Products → Import.
// Images are fetched by Shopify from the live site, so publish before importing.
// Run: node scripts/shopify-products-csv.ts
import { writeFileSync } from "node:fs";
import { previewProducts } from "../lib/commerce/preview-catalog.ts";

const SITE = "https://www.pamperagolf.com";
const columns = [
  "Handle", "Title", "Body (HTML)", "Vendor", "Type", "Tags", "Published",
  "Option1 Name", "Option1 Value", "Variant SKU", "Variant Inventory Tracker", "Variant Inventory Qty",
  "Variant Inventory Policy", "Variant Fulfillment Service", "Variant Price", "Variant Requires Shipping",
  "Variant Taxable", "Image Src", "Image Position", "Image Alt Text", "Status",
  "Subtitle (product.metafields.custom.subtitle)",
];
const cell = (v: string | number = "") => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));

const rows: Record<string, string | number>[] = [];
for (const p of previewProducts) {
  const n = Math.max(p.variants.length, p.images.length);
  for (let i = 0; i < n; i++) {
    const v = p.variants[i];
    const img = p.images[i];
    const row: Record<string, string | number> = { Handle: p.handle };
    if (i === 0) {
      Object.assign(row, {
        Title: p.title, "Body (HTML)": p.descriptionHtml, Vendor: "Pampera", Type: "Headcover",
        Tags: "Las Pampas", Published: "TRUE", "Option1 Name": "Size", Status: "active",
        "Subtitle (product.metafields.custom.subtitle)": p.subtitle ?? "",
      });
    }
    if (v) {
      Object.assign(row, {
        "Option1 Value": v.title,
        "Variant SKU": `PAM-${p.handle.toUpperCase()}-${v.title === "Driver" ? "DR" : "FW"}`,
        "Variant Inventory Tracker": "shopify", "Variant Inventory Qty": v.quantityAvailable ?? 0,
        "Variant Inventory Policy": "deny", "Variant Fulfillment Service": "manual",
        "Variant Price": v.price.amount, "Variant Requires Shipping": "TRUE", "Variant Taxable": "TRUE",
      });
    }
    if (img) Object.assign(row, { "Image Src": SITE + img.url, "Image Position": i + 1, "Image Alt Text": img.altText ?? "" });
    rows.push(row);
  }
}
writeFileSync("docs/shopify-products.csv", [columns.join(","), ...rows.map((r) => columns.map((c) => cell(r[c])).join(","))].join("\n") + "\n");
console.log(`${previewProducts.length} products, ${rows.length} rows → docs/shopify-products.csv`);
