/**
 * Locales (nov 2026): English (principal, §9) and Spanish. Every route lives
 * under /en or /es (app/[lang]); proxy.ts sends unprefixed URLs to the
 * visitor's language (cookie → Accept-Language → English).
 * Client-safe: no server-only imports here.
 */
export const LOCALES = ["en", "es"] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const hasLocale = (value: string): value is Lang => (LOCALES as readonly string[]).includes(value);

/** "/shop" → "/es/shop"; "/" → "/es". */
export function localePath(lang: Lang, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? `/${lang}` : `/${lang}${clean}`;
}

/** "/es/shop/rings" → "/shop/rings"; "/en" → "/". */
export function stripLocale(pathname: string): string {
  const m = pathname.match(/^\/(en|es)(?=\/|$)(.*)$/);
  if (!m) return pathname || "/";
  return m[2] || "/";
}

/** Same page in the other language (keeps query and hash). */
export function switchLocaleHref(pathname: string, to: Lang, search = ""): string {
  return localePath(to, stripLocale(pathname)) + search;
}

/** BCP 47 tag for Intl / <html lang> / hreflang. */
export const INTL_LOCALE: Record<Lang, string> = { en: "en-US", es: "es-MX" };

/** "1980s" → "Años 80" in Spanish; ranges "1970s–1980s" → "Años 70–80". Values stay canonical. */
export function decadeLabel(decade: string, lang: Lang): string {
  if (!decade || lang === "en") return decade;
  const parts = decade.split(/[–-]/).map((d) => d.trim());
  const short = parts.map((d) => {
    const m = d.match(/^(\d{4})s$/);
    if (!m) return d;
    return m[1].startsWith("19") ? m[1].slice(2) : m[1];
  });
  return `Años ${short.join("–")}`;
}
