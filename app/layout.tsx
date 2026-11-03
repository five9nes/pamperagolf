import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-context";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PreviewBanner } from "@/components/preview-banner";
import { commerce } from "@/lib/commerce";
import { site } from "@/lib/site";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="min-h-dvh bg-paper font-sans text-ink">
        <CartProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
          >
            Skip to content
          </a>
          {commerce.mode === "preview" && <PreviewBanner />}
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
