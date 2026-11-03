import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter_Tight } from "next/font/google";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-context";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Motion } from "@/components/motion";
import { Preloader, introScript } from "@/components/preloader";
import { PreviewBanner } from "@/components/preview-banner";
import { commerce } from "@/lib/commerce";
import { site } from "@/lib/site";
import "./globals.css";

const sans = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
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
  themeColor: "#f2f2f2",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The inline script adds a class and data-intro before hydration.
    <html lang="en" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="min-h-dvh bg-paper font-sans text-ink">
        <CartProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
          >
            Skip to content
          </a>
          <Preloader />
          <Header />
          {/* Sits above the footer, which is revealed from underneath as the page ends. */}
          <main id="main" className="relative z-10 bg-paper pt-14 md:pt-16">
            {children}
          </main>
          <Footer />
          {commerce.mode === "preview" && <PreviewBanner />}
          <CartDrawer />
          <Motion />
        </CartProvider>
      </body>
    </html>
  );
}
