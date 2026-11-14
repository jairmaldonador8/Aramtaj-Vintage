import data from "../../../data/products.json";
import type { CatalogSource, Piece } from "./types";

const pieces = data as Piece[];

/** Temporary source: data/products.json, same shape Shopify will provide. */
export const localSource: CatalogSource = {
  async listPieces() {
    return pieces;
  },
  async getPiece(handle) {
    return pieces.find((p) => p.handle === handle) ?? null;
  },
};
