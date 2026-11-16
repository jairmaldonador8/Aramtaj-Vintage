/**
 * Canonical piece model. Mirrors what Shopify will return
 * (product + variant price + metafields in the `custom` namespace),
 * so swapping the data source never touches components.
 */

export type SaleStatus = "available" | "reserved" | "sold";

export type Category =
  | "necklaces"
  | "earrings"
  | "bracelets"
  | "rings"
  | "brooches";

export type EarringType = "clip" | "pierced";

export interface Money {
  amount: number;
  /** ISO 4217. USD in every phase (CLAUDE.md §10). */
  currencyCode: string;
}

export interface PieceImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface Piece {
  /** Shopify GID once connected; local id for now. */
  id: string;
  /** URL slug (Shopify `handle`). */
  handle: string;
  /** Designer-first, e.g. "Christian Dior Gold-Tone Collar". */
  title: string;
  descriptionHtml: string;
  /** null = not set yet (shows "Price on request"). */
  price: Money | null;
  images: PieceImage[];
  category: Category;
  /** Drop / Edit this piece belongs to (Shopify collection handle later). */
  edit?: string;
  createdAt: string;

  // Metafields (custom.*)
  designer: string;
  decade: string;
  origin?: string;
  materials?: string;
  condition?: string;
  measurements?: string;
  clasp?: string;
  earringType?: EarringType;
  saleStatus: SaleStatus;

  /** True for placeholder data that must never ship to production. */
  isSample?: boolean;

  /** Spanish copy (nov 2026). Missing fields fall back to English. */
  translations?: { es?: PieceTranslation };
}

export type PieceTranslation = Partial<
  Pick<Piece, "title" | "descriptionHtml" | "materials" | "condition" | "origin" | "measurements" | "clasp">
>;

export interface CatalogFilters {
  category?: Category;
  designer?: string;
  decade?: string;
  earringType?: EarringType;
  /** Defaults to available + reserved (sold pieces live in the Archive). */
  status?: SaleStatus[];
}

export interface CatalogSource {
  listPieces(filters?: CatalogFilters): Promise<Piece[]>;
  getPiece(handle: string): Promise<Piece | null>;
}
