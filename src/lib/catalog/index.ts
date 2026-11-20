import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { localSource } from "./local";
import { shopifySource } from "./shopify";
import type { Lang } from "@/lib/i18n";
import type { Category, CatalogFilters, Piece, SaleStatus } from "./types";

export type * from "./types";

/** Tag revalidated by the Shopify webhook route (step 6). */
export const CATALOG_TAG = "catalog";

const ACTIVE: SaleStatus[] = ["available", "reserved"];

/** "1970s–1980s" belongs to both decades, so ranges never show up as their own filter. */
export function decadesOf(p: Pick<Piece, "decade">): string[] {
  return p.decade
    .split(/[–-]/)
    .map((d) => d.trim())
    .filter(Boolean);
}

/**
 * Single entry point for catalog data. Components import from here only.
 * Switch sources with CATALOG_SOURCE=local|shopify (default: local).
 */
async function allPieces(): Promise<Piece[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  cacheLife("hours");
  const source = process.env.CATALOG_SOURCE === "shopify" ? shopifySource : localSource;
  const pieces = await source.listPieces();
  return [...pieces].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Piece in the requested language (Spanish fields fall back to English). */
export function localize(p: Piece, lang: Lang): Piece {
  const tr = lang === "es" ? p.translations?.es : undefined;
  if (!tr) return p;
  return {
    ...p,
    ...Object.fromEntries(Object.entries(tr).filter(([, v]) => v)),
    images: p.images.map((img, i) => ({ ...img, alt: i === 0 && tr.title ? tr.title : img.alt })),
  };
}

export async function listPieces(filters: CatalogFilters = {}, lang: Lang = "en"): Promise<Piece[]> {
  const status = filters.status ?? ACTIVE;
  return (await allPieces())
    .filter((p) => status.includes(p.saleStatus))
    .filter((p) => !filters.category || p.category === filters.category)
    .filter((p) => !filters.designer || p.designer === filters.designer)
    .filter((p) => !filters.decade || decadesOf(p).includes(filters.decade))
    .filter((p) => !filters.earringType || p.earringType === filters.earringType)
    .map((p) => localize(p, lang));
}

export async function listArchive(lang: Lang = "en"): Promise<Piece[]> {
  return listPieces({ status: ["sold"] }, lang);
}

export async function getPiece(handle: string, lang: Lang = "en"): Promise<Piece | null> {
  const p = (await allPieces()).find((x) => x.handle === handle);
  return p ? localize(p, lang) : null;
}

export async function listAllHandles(): Promise<string[]> {
  return (await allPieces()).map((p) => p.handle);
}

/** Pieces in the most recent Edit (drop). */
export async function getCurrentEdit(lang: Lang = "en"): Promise<{ handle: string; pieces: Piece[] } | null> {
  const active = await listPieces({}, lang);
  const handle = active.find((p) => p.edit)?.edit;
  return handle ? { handle, pieces: active.filter((p) => p.edit === handle) } : null;
}

const uniq = <T extends string>(xs: (T | undefined)[]) =>
  [...new Set(xs.filter((x): x is T => Boolean(x)))].sort();

/** Only values present in the real inventory (never show empty filters). */
export async function getFacets(category?: Category) {
  const all = await allPieces();
  const active = all.filter((p) => ACTIVE.includes(p.saleStatus));
  const scoped = category ? active.filter((p) => p.category === category) : active;
  return {
    categories: uniq<Category>(active.map((p) => p.category)),
    designers: uniq(scoped.map((p) => p.designer)),
    decades: uniq(scoped.flatMap(decadesOf)),
    earringTypes: uniq(scoped.map((p) => p.earringType)),
    allDesigners: uniq(all.map((p) => p.designer)),
  };
}
