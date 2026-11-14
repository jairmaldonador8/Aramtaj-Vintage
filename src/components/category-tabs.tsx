import Link from "next/link";
import type { Category } from "@/lib/catalog/types";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/site";

/** Only categories with real inventory are shown (no empty collections). */
export function CategoryTabs({ categories, current }: { categories: Category[]; current?: Category }) {
  const ordered = CATEGORY_ORDER.filter((c) => categories.includes(c));
  const tab = (active: boolean) =>
    `block shrink-0 border-b-2 pb-2 text-xs font-medium tracking-[0.14em] uppercase transition-colors ${
      active ? "border-ink" : "border-transparent text-muted hover:text-ink"
    }`;
  return (
    <nav aria-label="Categories" className="-mx-4 mt-8 mb-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex gap-6">
        <li>
          <Link href="/shop" className={tab(!current)}>
            All
          </Link>
        </li>
        {ordered.map((c) => (
          <li key={c}>
            <Link href={`/shop/${c}`} className={tab(current === c)}>
              {CATEGORY_LABELS[c]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
