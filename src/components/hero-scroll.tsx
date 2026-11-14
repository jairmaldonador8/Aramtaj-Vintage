"use client";

import { useEffect } from "react";

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Scroll choreography for the home hero (renders nothing):
 *  - --hero-fade (0 → 1): the hero copy and the big signed mark recede;
 *    the mark "exhales" (blur + slight scale) instead of travelling.
 *  - data-nav-mark: once the big mark has mostly dissolved, the small
 *    header mark appears and signs itself (CSS in globals.css). Hysteresis
 *    avoids flicker around the threshold.
 *  - --hero-p: header is clear over the dark hero, marfil glass after it.
 */
export function HeroScroll({ heroId }: { heroId: string }) {
  useEffect(() => {
    const root = document.documentElement;
    const hero = document.getElementById(heroId);
    const header = document.querySelector<HTMLElement>(".site-header");
    let frame = 0;

    const update = () => {
      frame = 0;
      const fade = clamp(window.scrollY / (window.innerHeight * 0.34));
      root.style.setProperty("--hero-fade", fade.toFixed(3));

      const shown = root.hasAttribute("data-nav-mark");
      if (!shown && fade > 0.62) root.setAttribute("data-nav-mark", "");
      else if (shown && fade < 0.3) root.removeAttribute("data-nav-mark");

      const overHero =
        !!hero && !!header && hero.getBoundingClientRect().bottom > header.getBoundingClientRect().bottom + 1;
      root.style.setProperty("--hero-p", overHero ? "0" : "1");
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      root.style.removeProperty("--hero-p");
      root.style.removeProperty("--hero-fade");
      root.removeAttribute("data-nav-mark");
    };
  }, [heroId]);

  return null;
}
