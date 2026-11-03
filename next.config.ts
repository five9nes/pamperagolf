import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // One higher quality for every image; the default 75 softens the cloth texture.
    qualities: [85],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      // Instagram post images (lib/instagram.ts)
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
    ],
  },
};

export default nextConfig;
