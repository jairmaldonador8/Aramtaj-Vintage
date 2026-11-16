import Link from "next/link";
import type { Category } from "@/lib/catalog/types";
import { localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/locale-server";
import { CATEGORY_ORDER } from "@/lib/site";

/** Only categories with real inventory are shown (no empty collections). All fit on a phone (they wrap). */
export async function CategoryTabs({ categories, current }: { categories: Category[]; current?: Category }) {
  const { lang, t } = await getI18n();
  const ordered = CATEGORY_ORDER.filter((c) => categories.includes(c));
  const tab = (active: boolean) =>
    `inline-flex min-h-10 items-end border-b-2 pb-2 text-[11.5px] font-medium tracking-[0.14em] uppercase transition-colors sm:text-xs ${
      active ? "border-ink" : "border-transparent text-muted hover:text-ink"
    }`;
  return (
    <nav aria-label="Categories" className="mt-8 mb-6">
      <ul className="flex flex-wrap gap-x-5 gap-y-1 sm:gap-x-6">
        <li>
          <Link href={localePath(lang, "/shop")} className={tab(!current)} aria-current={!current ? "page" : undefined}>
            {t.shop.allTab}
          </Link>
        </li>
        {ordered.map((c) => (
          <li key={c}>
            <Link
              href={localePath(lang, `/shop/${c}`)}
              className={tab(current === c)}
              aria-current={current === c ? "page" : undefined}
            >
              {t.categories[c]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
