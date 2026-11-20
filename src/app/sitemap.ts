import type { MetadataRoute } from "next";
import { getFacets, listPieces } from "@/lib/catalog";
import { INTL_LOCALE, localePath, LOCALES } from "@/lib/i18n";
import { site } from "@/lib/site";

/** Every page in English and Spanish, each entry listing its language alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pieces, archive, { categories }] = await Promise.all([
    listPieces(),
    listPieces({ status: ["sold"] }),
    getFacets(),
  ]);
  const paths: { path: string; lastModified?: string }[] = [
    ...["/", "/shop", "/designers", "/about", "/help"].map((path) => ({ path })),
    ...(archive.length ? [{ path: "/archive" }] : []),
    ...categories.map((c) => ({ path: `/shop/${c}` })),
    ...[...pieces, ...archive]
      .filter((p) => !p.isSample)
      .map((p) => ({ path: `/pieces/${p.handle}`, lastModified: p.createdAt })),
  ];
  const languages = (path: string) =>
    Object.fromEntries(LOCALES.map((l) => [INTL_LOCALE[l], `${site.url}${localePath(l, path)}`]));
  return paths.flatMap(({ path, lastModified }) =>
    LOCALES.map((lang) => ({
      url: `${site.url}${localePath(lang, path)}`,
      lastModified,
      alternates: { languages: languages(path) },
    })),
  );
}
