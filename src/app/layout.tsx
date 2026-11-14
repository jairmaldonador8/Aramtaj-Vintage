import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { PageTransition } from "@/components/page-transition";
import { RevealObserver } from "@/components/reveal-observer";
import { AnnouncementBar } from "@/components/announcement-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { site } from "@/lib/site";
import "./globals.css";

/*
 * Typography (ronda 2): Cormorant Garamond for display, Jost for UI and text.
 * To swap (e.g. Canela + Neue Montreal): change these two loaders only.
 */
const sans = Jost({
  variable: "--font-sans-family",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const serif = Cormorant_Garamond({
  variable: "--font-serif-family",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Signed Vintage Jewelry, One of One`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    siteName: site.name,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F2EDE2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <AnnouncementBar />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <WhatsAppFloat />
        <RevealObserver />
        <PageTransition />
      </body>
    </html>
  );
}
