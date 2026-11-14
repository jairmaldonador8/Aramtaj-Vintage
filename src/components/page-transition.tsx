"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SignatureMark } from "@/components/signature-mark";

/** Long enough for the quick signature to close and fill (see .sig-transition). */
const MIN_VISIBLE_MS = 1150;
/** Never trap the visitor behind the curtain. */
const MAX_VISIBLE_MS = 6000;

type State = "idle" | "in" | "out";

/**
 * Marfil curtain with the isotipo signing itself, shown every time the
 * visitor enters a new section (link click or back/forward). It stays up
 * for at least one full signature, even if the page is already there, then
 * lifts. Filters (same path, new query) and in-page anchors don't trigger it.
 */
export function PageTransition() {
  const pathname = usePathname();
  const [state, setState] = useState<State>("idle");
  const [run, setRun] = useState(0); // remounts the mark so the signature replays
  const startedAt = useRef(0);
  const fromPath = useRef(pathname);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const lift = () => {
    clearTimers();
    const wait = Math.max(0, MIN_VISIBLE_MS - (performance.now() - startedAt.current));
    timers.current.push(
      window.setTimeout(() => {
        setState("out");
        timers.current.push(window.setTimeout(() => setState("idle"), 500));
      }, wait),
    );
  };

  // Start: intercept navigations to a different pathname.
  useEffect(() => {
    const begin = () => {
      clearTimers();
      fromPath.current = window.location.pathname;
      startedAt.current = performance.now();
      setRun((n) => n + 1);
      setState("in");
      timers.current.push(window.setTimeout(lift, MAX_VISIBLE_MS));
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // filters, anchors, same page
      begin();
    };
    const onPop = () => {
      if (window.location.pathname !== fromPath.current) begin();
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // While the curtain is up, the page beneath holds its own entrance animations.
  useEffect(() => {
    const root = document.documentElement;
    if (state === "in") root.setAttribute("data-curtain", "");
    else root.removeAttribute("data-curtain");
  }, [state]);

  // End: the new section has rendered.
  useEffect(() => {
    if (state === "in" && pathname !== fromPath.current) lift();
    if (state === "idle") fromPath.current = pathname;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, state]);

  return (
    <div
      className="page-curtain fixed inset-0 z-[70] flex items-center justify-center bg-cream"
      data-state={state === "idle" ? undefined : state}
      aria-hidden={state === "idle"}
      role={state === "in" ? "status" : undefined}
      aria-label={state === "in" ? "Loading" : undefined}
    >
      {state !== "idle" && (
        <div className="curtain-mark flex flex-col items-center">
          <SignatureMark key={run} uid={`curtain-${run}`} variant="transition" className="h-14 w-auto text-bronze md:h-16" />
        </div>
      )}
    </div>
  );
}
