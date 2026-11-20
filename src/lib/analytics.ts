"use client";

type Params = Record<string, string | number | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Set in .env.local / Vercel. Empty = that script is never loaded (see <Analytics />). */
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? "";
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

/**
 * Our events and the Meta standard event each one also counts as, so Meta Ads
 * (step 3) can optimize for them without renaming anything.
 * In GA4, mark `whatsapp_click` and `launch_list_signup` as key events.
 */
const META_STANDARD: Record<string, string> = {
  whatsapp_click: "Contact",
  launch_list_signup: "Lead",
};

/**
 * Sends an event to GA4 and Meta Pixel. Safe no-op while their IDs are not set.
 * Params stay flat strings/numbers (GA4 custom dimensions, Meta custom data).
 */
export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
  const standard = META_STANDARD[event];
  if (standard) window.fbq?.("track", standard, params);
  window.fbq?.("trackCustom", event, params);
  if (process.env.NODE_ENV === "development") {
    console.debug("[track]", event, params);
  }
}

export interface ViewedPiece {
  id: string;
  handle: string;
  title: string;
  designer: string;
  category: string;
  price: number | null;
}

/** A piece page was seen: GA4 `view_item` (ecommerce) + Meta `ViewContent`. */
export function trackPieceView(p: ViewedPiece) {
  if (typeof window === "undefined") return;
  const value = p.price ?? undefined;
  window.gtag?.("event", "view_item", {
    currency: "USD",
    value,
    items: [
      {
        item_id: p.id,
        item_name: p.title,
        item_brand: p.designer || undefined,
        item_category: p.category,
        price: value,
        quantity: 1,
      },
    ],
  });
  window.fbq?.("track", "ViewContent", {
    content_ids: [p.id],
    content_name: p.title,
    content_category: p.category,
    content_type: "product",
    value,
    currency: "USD",
  });
  if (process.env.NODE_ENV === "development") {
    console.debug("[track] view_item", p.handle);
  }
}
