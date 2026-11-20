"use client";

import { useCurrency, useI18n } from "@/components/providers";
import type { Money } from "@/lib/catalog/types";
import { INTL_LOCALE } from "@/lib/i18n";

/** Pesos are shown rounded to the nearest 10, marked as approximate. */
const roundMxn = (n: number) => Math.round(n / 10) * 10;

/** "$185 USD" or "≈ $3,240 MXN", following the visitor's currency choice. */
export function Price({ price, className }: { price: Money | null; className?: string }) {
  const { currency, rate } = useCurrency();
  const { lang, t } = useI18n();
  if (!price) return <span className={className}>{t.price.onRequest}</span>;
  const fmt = (n: number) => new Intl.NumberFormat(INTL_LOCALE[lang], { maximumFractionDigits: 0 }).format(n);
  const text =
    currency === "MXN" && rate && price.currencyCode === "USD"
      ? `≈ $${fmt(roundMxn(price.amount * rate))} MXN`
      : `$${fmt(price.amount)} ${price.currencyCode}`;
  return <span className={`tabular-nums ${className ?? ""}`}>{text}</span>;
}

/** Small note under the price on the piece page when pesos are shown. */
export function PriceNote({ className }: { className?: string }) {
  const { currency } = useCurrency();
  const { t } = useI18n();
  if (currency !== "MXN") return null;
  return <p className={className}>{t.price.mxnNote}</p>;
}
