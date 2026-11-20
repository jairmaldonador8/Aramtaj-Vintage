import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CategoryTabs } from "@/components/category-tabs";
import { GridSkeleton, ShopListing } from "@/components/shop-listing";
import { getFacets } from "@/lib/catalog";
import type { Category } from "@/lib/catalog/types";
import { alternatesFor, getI18n } from "@/lib/locale-server";
import { CATEGORY_ORDER } from "@/lib/site";

function isCategory(value: string): value is Category {
  return (CATEGORY_ORDER as string[]).includes(value);
}

export async function generateStaticParams() {
  const { categories } = await getFacets();
  return categories.map((category) => ({ category }));
}

export async function generateMetadata(props: PageProps<"/[lang]/shop/[category]">): Promise<Metadata> {
  const { category } = await props.params;
  if (!isCategory(category)) return {};
  const { lang, t } = await getI18n();
  const label = t.categories[category];
  return {
    title: t.meta.category.title(label),
    description: t.meta.category.description(label),
    alternates: alternatesFor(lang, `/shop/${category}`),
  };
}

async function CategoryContent(props: PageProps<"/[lang]/shop/[category]">) {
  const { category } = await props.params;
  const { t } = await getI18n();
  const { categories } = await getFacets();
  if (!isCategory(category) || !categories.includes(category)) notFound();

  return (
    <>
      <h1 className="display-lg mt-3">{t.categories[category]}</h1>
      <CategoryTabs categories={categories} current={category} />
      <Suspense fallback={<GridSkeleton />}>
        <ShopListing category={category} searchParams={props.searchParams} />
      </Suspense>
    </>
  );
}

export default async function CategoryPage(props: PageProps<"/[lang]/shop/[category]">) {
  const { t } = await getI18n();
  return (
    <div className="container-site pt-12 md:pt-16">
      <p className="eyebrow">{t.shop.eyebrow}</p>
      <Suspense fallback={<GridSkeleton />}>
        <CategoryContent {...props} />
      </Suspense>
    </div>
  );
}
