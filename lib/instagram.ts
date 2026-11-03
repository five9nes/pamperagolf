import "server-only";

export type InstagramPost = {
  id: string;
  permalink: string;
  image: string;
  caption: string | null;
};

type MediaItem = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
};

/**
 * Latest posts from the brand account via the Instagram API (Instagram Login).
 * Returns [] when INSTAGRAM_ACCESS_TOKEN is missing, expired or the request fails,
 * so the page can fall back to its own photography. See docs/INSTAGRAM_SETUP.md.
 */
export async function getInstagramPosts(limit = 6): Promise<InstagramPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return [];

  const url = new URL("https://graph.instagram.com/me/media");
  url.search = new URLSearchParams({
    fields: "id,caption,media_type,media_url,thumbnail_url,permalink",
    limit: String(limit * 2),
    access_token: token,
  }).toString();

  try {
    const res = await fetch(url, { next: { revalidate: 3600, tags: ["instagram"] } });
    if (!res.ok) return [];
    const { data } = (await res.json()) as { data: MediaItem[] };
    return data
      .flatMap((item) => {
        const image = item.media_type === "VIDEO" ? item.thumbnail_url : item.media_url;
        return image ? [{ id: item.id, permalink: item.permalink, image, caption: item.caption ?? null }] : [];
      })
      .slice(0, limit);
  } catch {
    return [];
  }
}
