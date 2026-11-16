"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useCurrency, useI18n } from "@/components/providers";
import { LOCALE_COOKIE, LOCALES, switchLocaleHref, type Lang } from "@/lib/i18n";

const seg = (active: boolean) =>
  `inline-flex min-h-11 min-w-9 items-center justify-center px-1 text-[11px] font-medium tracking-[0.16em] uppercase transition-colors ${
    // Inactive at 70% keeps 4.5:1 contrast on both the cream header and the dark hero.
    active ? "text-current underline decoration-1 underline-offset-[5px]" : "opacity-70 hover:opacity-100"
  }`;

/** Remembered by proxy.ts for URLs without a locale. */
function rememberLocale(l: Lang) {
  document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
}

function LocaleLinks() {
  const { lang, t } = useI18n();
  const pathname = usePathname();
  const search = useSearchParams().toString();
  return (
    <div role="group" aria-label={t.nav.language} className="flex items-center">
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span aria-hidden className="opacity-40">/</span>}
          <Link
            href={switchLocaleHref(pathname, l, search ? `?${search}` : "")}
            onClick={() => rememberLocale(l)}
            hrefLang={l}
            lang={l}
            aria-current={l === lang ? "true" : undefined}
            className={seg(l === lang)}
            scroll={false}
          >
            {l}
          </Link>
        </span>
      ))}
    </div>
  );
}

/** EN / ES — keeps the visitor on the same page. */
export function LocaleSwitcher() {
  return (
    <Suspense fallback={<span className="min-h-11 min-w-16" />}>
      <LocaleLinks />
    </Suspense>
  );
}

/** USD / MXN — prices are USD; pesos are an approximate conversion. */
export function CurrencySwitcher() {
  const { currency, setCurrency, rate } = useCurrency();
  const { t } = useI18n();
  if (!rate) return null;
  return (
    <div role="group" aria-label={t.nav.currency} className="flex items-center">
      {(["USD", "MXN"] as const).map((c, i) => (
        <span key={c} className="flex items-center">
          {i > 0 && <span aria-hidden className="opacity-40">/</span>}
          <button type="button" onClick={() => setCurrency(c)} aria-pressed={currency === c} className={seg(currency === c)}>
            {c}
          </button>
        </span>
      ))}
    </div>
  );
}
