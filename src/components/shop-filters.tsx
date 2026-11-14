import Link from "next/link";
import type { EarringType } from "@/lib/catalog/types";
import { EARRING_LABELS } from "@/lib/site";

type Active = { designer?: string; decade?: string; type?: string };

function hrefWith(base: string, active: Active, key: keyof Active, value?: string) {
  const params = new URLSearchParams();
  const next = { ...active, [key]: value };
  for (const [k, v] of Object.entries(next)) if (v) params.set(k, v);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

function Group({
  label,
  base,
  active,
  paramKey,
  options,
}: {
  label: string;
  base: string;
  active: Active;
  paramKey: keyof Active;
  options: { value: string; label: string }[];
}) {
  // A filter with a single option filters nothing — hide it.
  if (options.length < 2) return null;
  const current = active[paramKey];
  const chip = (selected: boolean) =>
    `inline-flex min-h-9 items-center border px-3 text-xs tracking-[0.06em] transition-colors ${
      selected ? "border-ink bg-ink text-cream" : "border-line hover:border-ink"
    }`;
  return (
    <div>
      <p className="eyebrow mb-3">{label}</p>
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link href={hrefWith(base, active, paramKey)} className={chip(!current)} scroll={false}>
            All
          </Link>
        </li>
        {options.map((o) => (
          <li key={o.value}>
            <Link
              href={hrefWith(base, active, paramKey, o.value)}
              className={chip(current === o.value)}
              scroll={false}
            >
              {o.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

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
  return (
    <div className="grid gap-6 border-b border-line py-6 md:grid-cols-3 md:border-t">
      <Group
        label="Designer"
        base={base}
        active={active}
        paramKey="designer"
        options={designers.map((d) => ({ value: d, label: d }))}
      />
      <Group
        label="Decade"
        base={base}
        active={active}
        paramKey="decade"
        options={decades.map((d) => ({ value: d, label: d }))}
      />
      <Group
        label="Earring type"
        base={base}
        active={active}
        paramKey="type"
        options={earringTypes.map((t) => ({ value: t, label: EARRING_LABELS[t] }))}
      />
    </div>
  );
}
