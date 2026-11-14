"use client";

type Params = Record<string, string | number | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Sends an event to GA4 and Meta Pixel when they are loaded (step 5).
 * Safe no-op until the scripts are installed.
 */
export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
  window.fbq?.("trackCustom", event, params);
  if (process.env.NODE_ENV === "development") {
    console.debug("[track]", event, params);
  }
}
