import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoryTabs } from "@/components/category-tabs";
import { GridSkeleton, ShopListing } from "@/components/shop-listing";
import { getFacets } from "@/lib/catalog";
import { alternatesFor, getI18n } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t } = await getI18n();
  return { title: t.meta.shop.title, description: t.meta.shop.description, alternates: alternatesFor(lang, "/shop") };
}

export default async function ShopPage(props: PageProps<"/[lang]/shop">) {
  const { t } = await getI18n();
  const { categories } = await getFacets();
  return (
    <div className="container-site pt-12 md:pt-16">
      <p className="eyebrow">{t.shop.eyebrow}</p>
      <h1 className="display-lg mt-3">{t.shop.all}</h1>
      <CategoryTabs categories={categories} />
      <Suspense fallback={<GridSkeleton />}>
        <ShopListing searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
