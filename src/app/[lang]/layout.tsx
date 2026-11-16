import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { PageTransition } from "@/components/page-transition";
import { Providers } from "@/components/providers";
import { RevealObserver } from "@/components/reveal-observer";
import { AnnouncementBar } from "@/components/announcement-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { listArchive } from "@/lib/catalog";
import { getDict } from "@/lib/dictionary";
import { INTL_LOCALE, LOCALES } from "@/lib/i18n";
import { alternatesFor, getLang } from "@/lib/locale-server";
import { getUsdMxnRate } from "@/lib/rates";
import { site } from "@/lib/site";
import "../globals.css";

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

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const t = getDict(lang);
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name} — ${t.meta.tagline}`, template: `%s — ${site.name}` },
    description: t.meta.description,
    alternates: alternatesFor(lang, "/"),
    openGraph: { siteName: site.name, type: "website", locale: INTL_LOCALE[lang].replace("-", "_") },
  };
}

export const viewport: Viewport = {
  themeColor: "#F2EDE2",
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const lang = await getLang();
  const [rate, archive] = await Promise.all([getUsdMxnRate(), listArchive()]);
  return (
    <html lang={lang} className={`${sans.variable} ${serif.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <Providers lang={lang} rate={rate}>
          <AnnouncementBar />
          {/* Archive is only linked once something has sold (no empty sections, §7). */}
          <SiteHeader showArchive={archive.length > 0} />
          <main className="flex-1">{children}</main>
          <SiteFooter showArchive={archive.length > 0} />
          <WhatsAppFloat />
          <RevealObserver />
          <PageTransition />
        </Providers>
      </body>
    </html>
  );
}
