import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CategoryTabs } from "@/components/category-tabs";
import { GridSkeleton, ShopListing } from "@/components/shop-listing";
import { getFacets } from "@/lib/catalog";
import type { Category } from "@/lib/catalog/types";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/site";

function isCategory(value: string): value is Category {
  return (CATEGORY_ORDER as string[]).includes(value);
}

export async function generateStaticParams() {
  const { categories } = await getFacets();
  return categories.map((category) => ({ category }));
}

export async function generateMetadata(props: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category } = await props.params;
  if (!isCategory(category)) return {};
  const label = CATEGORY_LABELS[category];
  return {
    title: `Vintage Signed ${label}`,
    description: `One-of-one signed vintage ${label.toLowerCase()} from the 1960s to the 1990s, handpicked across Europe.`,
    alternates: { canonical: `/shop/${category}` },
  };
}

async function CategoryContent(props: PageProps<"/shop/[category]">) {
  const { category } = await props.params;
  const { categories } = await getFacets();
  if (!isCategory(category) || !categories.includes(category)) notFound();

  return (
    <>
      <h1 className="display-lg mt-3">{CATEGORY_LABELS[category]}</h1>
      <CategoryTabs categories={categories} current={category} />
      <Suspense fallback={<GridSkeleton />}>
        <ShopListing category={category} searchParams={props.searchParams} />
      </Suspense>
    </>
  );
}

export default function CategoryPage(props: PageProps<"/shop/[category]">) {
  return (
    <div className="container-site pt-12 md:pt-16">
      <p className="eyebrow">The shop</p>
      <Suspense fallback={<GridSkeleton />}>
        <CategoryContent {...props} />
      </Suspense>
    </div>
  );
}
