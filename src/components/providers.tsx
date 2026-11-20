"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getDict, type Dict } from "@/lib/dictionary";
import type { Lang } from "@/lib/i18n";

/* ─── Language ─────────────────────────────────────────────────────────── */

const LangContext = createContext<Lang>("en");

export function useI18n(): { lang: Lang; t: Dict } {
  const lang = useContext(LangContext);
  return { lang, t: getDict(lang) };
}

/* ─── Currency ─────────────────────────────────────────────────────────── */

export type Currency = "USD" | "MXN";
const STORAGE_KEY = "aramtaj-currency";

type CurrencyState = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  /** USD→MXN rate; null when unavailable (then MXN is not offered). */
  rate: number | null;
};

const CurrencyContext = createContext<CurrencyState>({ currency: "USD", setCurrency: () => {}, rate: null });

export function useCurrency() {
  return useContext(CurrencyContext);
}

export function Providers({ lang, rate, children }: { lang: Lang; rate: number | null; children: React.ReactNode }) {
  // Prices are USD (CLAUDE.md §10). MXN is an opt-in, remembered per browser.
  const [currency, setState] = useState<Currency>("USD");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read the saved preference once, after hydration
      if (saved === "MXN" && rate) setState("MXN");
    } catch {}
  }, [rate]);

  const setCurrency = useCallback((c: Currency) => {
    setState(c);
    try {
      window.localStorage.setItem(STORAGE_KEY, c);
    } catch {}
  }, []);

  const value = useMemo(() => ({ currency: rate ? currency : "USD", setCurrency, rate }), [currency, setCurrency, rate]);

  return (
    <LangContext.Provider value={lang}>
      <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
    </LangContext.Provider>
  );
}
