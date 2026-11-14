"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** True once React has hydrated this node (streamed Suspense HTML may not be yet). */
const isHydrated = (el: Element) => Object.keys(el).some((k) => k.startsWith("__reactFiber"));

/**
 * Marks every [data-reveal] element with [data-shown] once it enters the
 * viewport (CSS in globals.css does the motion). Mounted once in the layout;
 * re-scans after client navigations and DOM changes (Suspense streams).
 * Never touches a node before React hydrates it, to avoid hydration mismatches.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const pending = new Set<Element>();
    let retry = 0;

    const show = (el: Element) => {
      // Wait for hydration, and for the page-transition curtain to lift.
      if (isHydrated(el) && !document.documentElement.hasAttribute("data-curtain")) {
        el.setAttribute("data-shown", "");
        io.unobserve(el);
        pending.delete(el);
      } else {
        pending.add(el);
        if (!retry) retry = window.setTimeout(flush, 120);
      }
    };
    const flush = () => {
      retry = 0;
      [...pending].forEach(show);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) show(e.target);
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    const scan = () =>
      document.querySelectorAll("[data-reveal]:not([data-shown])").forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      window.clearTimeout(retry);
    };
  }, [pathname]);

  return null;
}
