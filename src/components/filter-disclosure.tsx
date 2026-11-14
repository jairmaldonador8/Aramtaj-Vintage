"use client";

import { useState } from "react";

/** Filters fold behind a toggle on phones; always visible from md up. */
export function FilterDisclosure({ activeCount, children }: { activeCount: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="shop-filters"
        className="flex min-h-12 w-full items-center justify-between border-y border-line text-[11px] font-medium tracking-[0.2em] uppercase md:hidden"
      >
        <span>
          Filter{activeCount > 0 && <span className="ml-2 text-bronze">({activeCount})</span>}
        </span>
        <span aria-hidden className="text-base leading-none">
          {open ? "−" : "+"}
        </span>
      </button>
      <div id="shop-filters" className={open ? "block" : "hidden md:block"}>
        {children}
      </div>
    </div>
  );
}
