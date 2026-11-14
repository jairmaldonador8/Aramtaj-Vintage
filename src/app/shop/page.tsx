import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoryTabs } from "@/components/category-tabs";
import { GridSkeleton, ShopListing } from "@/components/shop-listing";
import { getFacets } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop Signed Vintage Jewelry",
  description:
    "Shop one-of-one signed vintage costume jewelry from the 1960s to the 1990s: necklaces, earrings, bracelets, rings and brooches.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage(props: PageProps<"/shop">) {
  const { categories } = await getFacets();
  return (
    <div className="container-site pt-12 md:pt-16">
      <p className="eyebrow">The shop</p>
      <h1 className="display-lg mt-3">All pieces</h1>
      <CategoryTabs categories={categories} />
      <Suspense fallback={<GridSkeleton />}>
        <ShopListing searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
