import type { MetadataRoute } from "next";
import { getFacets, listPieces } from "@/lib/catalog";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pieces, archive, { categories }] = await Promise.all([
    listPieces(),
    listPieces({ status: ["sold"] }),
    getFacets(),
  ]);
  const staticRoutes = ["", "/shop", "/designers", "/archive", "/about", "/help"].map((path) => ({
    url: `${site.url}${path}`,
  }));
  const categoryRoutes = categories.map((c) => ({ url: `${site.url}/shop/${c}` }));
  const pieceRoutes = [...pieces, ...archive]
    .filter((p) => !p.isSample)
    .map((p) => ({ url: `${site.url}/pieces/${p.handle}`, lastModified: p.createdAt }));
  return [...staticRoutes, ...categoryRoutes, ...pieceRoutes];
}
