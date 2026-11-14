import type { Category, CatalogSource, EarringType, Piece, SaleStatus } from "./types";

/**
 * Shopify GraphQL Admin API source.
 * NOT YET TESTED against Aram's store — pending collaborator access and
 * confirmation that her plan allows a Dev Dashboard app with read_products.
 * Metafield keys must match section 5 of CLAUDE.md once created in Shopify.
 */

const PRODUCT_FIELDS = /* GraphQL */ `
  id
  handle
  title
  descriptionHtml
  createdAt
  productType
  collections(first: 5) { nodes { handle } }
  media(first: 10) {
    nodes {
      ... on MediaImage { image { url altText width height } }
    }
  }
  variants(first: 1) { nodes { price } }
  metafields(namespace: "custom", first: 20) { nodes { key value } }
`;

type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  createdAt: string;
  productType: string;
  collections: { nodes: { handle: string }[] };
  media: {
    nodes: { image?: { url: string; altText: string | null; width: number; height: number } }[];
  };
  variants: { nodes: { price: string }[] };
  metafields: { nodes: { key: string; value: string }[] };
};

async function adminFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const version = process.env.SHOPIFY_API_VERSION;
  if (!domain || !token || !version) {
    throw new Error("Shopify env vars missing (SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_ACCESS_TOKEN, SHOPIFY_API_VERSION)");
  }
  const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables }),
    next: { tags: ["catalog"] },
  });
  const json = await res.json();
  if (!res.ok || json.errors) {
    throw new Error(`Shopify Admin API error: ${JSON.stringify(json.errors ?? res.status)}`);
  }
  return json.data as T;
}

const CATEGORY_BY_TYPE: Record<string, Category> = {
  necklace: "necklaces",
  necklaces: "necklaces",
  earrings: "earrings",
  earring: "earrings",
  bracelet: "bracelets",
  bracelets: "bracelets",
  ring: "rings",
  rings: "rings",
  brooch: "brooches",
  brooches: "brooches",
};

function toPiece(p: ShopifyProduct, currencyCode: string): Piece {
  const mf = Object.fromEntries(p.metafields.nodes.map((m) => [m.key, m.value]));
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    descriptionHtml: p.descriptionHtml,
    createdAt: p.createdAt,
    // TODO: confirm with Jair whether category comes from productType or a collection.
    category: CATEGORY_BY_TYPE[p.productType.trim().toLowerCase()] ?? "necklaces",
    edit: p.collections.nodes[0]?.handle,
    price: { amount: Number(p.variants.nodes[0]?.price ?? 0), currencyCode },
    images: p.media.nodes
      .filter((m) => m.image)
      .map((m) => ({
        url: m.image!.url,
        alt: m.image!.altText ?? p.title,
        width: m.image!.width,
        height: m.image!.height,
      })),
    designer: mf.designer ?? "",
    decade: mf.decade ?? "",
    origin: mf.origin,
    materials: mf.materials,
    condition: mf.condition,
    measurements: mf.measurements,
    clasp: mf.clasp,
    earringType: mf.earring_type as EarringType | undefined,
    saleStatus: (mf.sale_status as SaleStatus) ?? "available",
  };
}

export const shopifySource: CatalogSource = {
  async listPieces() {
    const data = await adminFetch<{
      shop: { currencyCode: string };
      products: { nodes: ShopifyProduct[] };
    }>(`query { shop { currencyCode } products(first: 250, query: "status:active") { nodes { ${PRODUCT_FIELDS} } } }`);
    return data.products.nodes.map((p) => toPiece(p, data.shop.currencyCode));
  },
  async getPiece(handle) {
    const data = await adminFetch<{
      shop: { currencyCode: string };
      productByIdentifier: ShopifyProduct | null;
    }>(
      `query($handle: String!) { shop { currencyCode } productByIdentifier(identifier: { handle: $handle }) { ${PRODUCT_FIELDS} } }`,
      { handle },
    );
    return data.productByIdentifier ? toPiece(data.productByIdentifier, data.shop.currencyCode) : null;
  },
};
