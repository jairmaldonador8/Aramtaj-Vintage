import { SignatureLoader } from "@/components/signature-mark";
import { PieceGrid } from "@/components/piece-card";
import { ShopFilters } from "@/components/shop-filters";
import { getFacets, listPieces } from "@/lib/catalog";
import type { Category, EarringType } from "@/lib/catalog/types";
import { localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/locale-server";

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

/** Filtered grid. Reads searchParams, so it must render inside <Suspense>. */
export async function ShopListing({
  category,
  searchParams,
}: {
  category?: Category;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang, t } = await getI18n();
  const sp = await searchParams;
  const active = { designer: first(sp.designer), decade: first(sp.decade), type: first(sp.type) };
  const [pieces, facets] = await Promise.all([
    listPieces({
      category,
      designer: active.designer,
      decade: active.decade,
      earringType: active.type as EarringType | undefined,
    }, lang),
    getFacets(category),
  ]);

  return (
    <>
      <ShopFilters
        base={localePath(lang, category ? `/shop/${category}` : "/shop")}
        active={active}
        designers={facets.designers}
        decades={facets.decades}
        earringTypes={facets.earringTypes}
      />
      <p className="my-6 text-xs tracking-[0.12em] text-muted uppercase">
        {t.shop.count(pieces.length)}
      </p>
      {pieces.length > 0 ? (
        <PieceGrid pieces={pieces} priorityCount={4} />
      ) : (
        <p className="py-20 text-center accent text-2xl text-muted">
          {t.shop.empty}
        </p>
      )}
    </>
  );
}

/** Suspense fallback for listings: the signing isotipo, centered. */
export function GridSkeleton() {
  return (
    <div className="flex min-h-[50svh] items-center justify-center">
      <SignatureLoader />
    </div>
  );
}
