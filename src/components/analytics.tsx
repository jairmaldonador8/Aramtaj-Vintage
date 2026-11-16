"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef } from "react";
import { GA4_ID, META_PIXEL_ID, trackPieceView, type ViewedPiece } from "@/lib/analytics";

/**
 * GA4 + Meta Pixel (CLAUDE.md §9). Each script loads only when its ID is set
 * (NEXT_PUBLIC_GA4_ID, NEXT_PUBLIC_META_PIXEL_ID), so local dev and previews
 * without IDs send nothing.
 *
 * Page views: GA4 counts client-side navigations itself (Enhanced measurement →
 * "Page changes based on browser history events", on by default); the Pixel is
 * told on every pathname change below.
 */
export function Analytics() {
  return (
    <>
      {GA4_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA4_ID}');`}
          </Script>
        </>
      )}
      {META_PIXEL_ID && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
          </Script>
          <PixelPageViews />
        </>
      )}
    </>
  );
}

function PixelPageViews() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    // The base code above already counted the landing page.
    if (first.current) {
      first.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);
  return null;
}

/** Rendered on each piece page: one `view_item` / `ViewContent` per piece seen. */
export function TrackPieceView(props: ViewedPiece) {
  const { handle } = props;
  const piece = useRef(props);
  useEffect(() => {
    if (!GA4_ID && !META_PIXEL_ID) return;
    // On a first visit the page can mount before <Analytics /> has defined gtag/fbq: wait briefly.
    let tries = 0;
    let timer = 0;
    const send = () => {
      const ready = (!GA4_ID || window.gtag) && (!META_PIXEL_ID || window.fbq);
      if (ready || tries++ > 20) trackPieceView(piece.current);
      else timer = window.setTimeout(send, 250);
    };
    send();
    return () => window.clearTimeout(timer);
  }, [handle]);
  return null;
}
