import type { MetadataRoute } from "next";
import { commerce } from "@/lib/commerce";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await commerce.getCollectionProducts();
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/story`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/shipping`, changeFrequency: "monthly", priority: 0.3 },
    ...products.map((p) => ({ url: `${site.url}/products/${p.handle}`, changeFrequency: "daily" as const, priority: 0.8 })),
  ];
}
