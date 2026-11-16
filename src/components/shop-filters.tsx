"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useI18n } from "@/components/providers";
import type { EarringType } from "@/lib/catalog/types";
import { decadeLabel } from "@/lib/i18n";

type Active = { designer?: string; decade?: string; type?: string };

function hrefWith(base: string, active: Active, key: keyof Active, value?: string) {
  const params = new URLSearchParams();
  const next = { ...active, [key]: value };
  for (const [k, v] of Object.entries(next)) if (v) params.set(k, v);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

function Select({
  label,
  value,
  options,
  onChange,
  allLabel,
}: {
  label: string;
  value?: string;
  options: { value: string; label: string }[];
  onChange: (value?: string) => void;
  allLabel: string;
}) {
  // A filter with a single option filters nothing — hide it.
  if (options.length < 2) return null;
  return (
    <label className="block min-w-0 sm:w-56">
      <span className="eyebrow mb-2 block">{label}</span>
      <span className="relative block">
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || undefined)}
          className={`w-full cursor-pointer appearance-none rounded-none border-b bg-transparent py-2 pr-7 text-[14px] tracking-[0.03em] outline-none transition-colors focus-visible:border-ink ${
            value ? "border-ink text-ink" : "border-line text-muted hover:border-ink"
          }`}
        >
          <option value="">{allLabel}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span aria-hidden className="pointer-events-none absolute top-1/2 right-1 -translate-y-1/2 text-[10px] text-muted">
          ▾
        </span>
      </span>
    </label>
  );
}

/** Compact filter bar: one dropdown per facet, URL-driven (shareable, server-rendered results). */
export function ShopFilters({
  base,
  active,
  designers,
  decades,
  earringTypes,
}: {
  base: string;
  active: Active;
  designers: string[];
  decades: string[];
  earringTypes: EarringType[];
}) {
  const { lang, t } = useI18n();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const go = (key: keyof Active) => (value?: string) =>
    startTransition(() => router.push(hrefWith(base, active, key, value), { scroll: false }));
  const anyActive = Object.values(active).some(Boolean);

  return (
    <div
      className={`grid grid-cols-2 items-end gap-x-6 gap-y-5 border-y border-line py-5 transition-opacity sm:flex sm:flex-wrap sm:gap-x-10 ${
        pending ? "opacity-60" : ""
      }`}
    >
      <Select
        label={t.shop.designer}
        allLabel={t.shop.allOption}
        value={active.designer}
        options={designers.map((d) => ({ value: d, label: d }))}
        onChange={go("designer")}
      />
      <Select
        label={t.shop.decade}
        allLabel={t.shop.allOption}
        value={active.decade}
        options={decades.map((d) => ({ value: d, label: decadeLabel(d, lang) }))}
        onChange={go("decade")}
      />
      <Select
        label={t.shop.earringType}
        allLabel={t.shop.allOption}
        value={active.type}
        options={earringTypes.map((e) => ({ value: e, label: t.earring[e] }))}
        onChange={go("type")}
      />
      {anyActive && (
        <button
          type="button"
          onClick={() => startTransition(() => router.push(base, { scroll: false }))}
          className="link-underline justify-self-start pb-2 text-[11px] tracking-[0.16em] uppercase sm:ml-auto"
        >
          {t.shop.clear}
        </button>
      )}
    </div>
  );
}
