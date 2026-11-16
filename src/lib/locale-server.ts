import { notFound } from "next/navigation";
import { lang as rootLang } from "next/root-params";
import { getDict } from "@/lib/dictionary";
import { hasLocale, localePath, LOCALES, INTL_LOCALE, type Lang } from "@/lib/i18n";

/** Current locale from the [lang] root segment (Server Components only). */
export async function getLang(): Promise<Lang> {
  const value = await rootLang();
  if (!hasLocale(value)) notFound();
  return value;
}

export async function getI18n() {
  const lang = await getLang();
  return { lang, t: getDict(lang) };
}

/** canonical + hreflang alternates for a path without locale ("/shop"). */
export function alternatesFor(lang: Lang, path: string) {
  return {
    canonical: localePath(lang, path),
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [INTL_LOCALE[l], localePath(l, path)])),
      "x-default": localePath("en", path),
    },
  };
}
