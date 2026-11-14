import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PieceGrid } from "@/components/piece-card";
import { PieceImage } from "@/components/piece-image";
import { SignatureLoader } from "@/components/signature-mark";
import { PurchaseAction } from "@/components/purchase-action";
import { getPiece, listAllHandles, listPieces } from "@/lib/catalog";
import type { Piece } from "@/lib/catalog/types";
import { CATEGORY_LABELS, EARRING_LABELS, formatPrice, site, STATUS_LABELS } from "@/lib/site";

export async function generateStaticParams() {
  const handles = await listAllHandles();
  return handles.map((handle) => ({ handle }));
}

function plainText(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata(props: PageProps<"/pieces/[handle]">): Promise<Metadata> {
  const { handle } = await props.params;
  const piece = await getPiece(handle);
  if (!piece) return {};
  const description =
    plainText(piece.descriptionHtml).slice(0, 155) ||
    `Signed ${piece.designer} vintage piece from the ${piece.decade}. One of one.`;
  return {
    title: `${piece.title} — ${piece.decade}`,
    description,
    alternates: { canonical: `/pieces/${piece.handle}` },
    openGraph: {
      title: piece.title,
      description,
      images: piece.images.slice(0, 1).map((i) => ({ url: i.url, width: i.width, height: i.height, alt: i.alt })),
    },
    robots: piece.isSample ? { index: false } : undefined,
  };
}

function productJsonLd(piece: Piece) {
  const availability = {
    available: "https://schema.org/InStock",
    reserved: "https://schema.org/LimitedAvailability",
    sold: "https://schema.org/SoldOut",
  }[piece.saleStatus];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: piece.title,
    description: plainText(piece.descriptionHtml),
    image: piece.images.map((i) => i.url),
    brand: { "@type": "Brand", name: piece.designer },
    itemCondition: "https://schema.org/UsedCondition",
    url: `${site.url}/pieces/${piece.handle}`,
    ...(piece.price && {
      offers: {
        "@type": "Offer",
        price: piece.price.amount,
        priceCurrency: piece.price.currencyCode,
        availability,
        url: `${site.url}/pieces/${piece.handle}`,
      },
    }),
  };
}

function Details({ piece }: { piece: Piece }) {
  const rows: [string, string | undefined][] = [
    ["Designer", piece.designer],
    ["Decade", piece.decade],
    ["Origin", piece.origin],
    ["Materials", piece.materials],
    ["Condition", piece.condition],
    ["Measurements", piece.measurements],
    ["Clasp", piece.clasp],
    ["Earring type", piece.earringType && EARRING_LABELS[piece.earringType]],
  ];
  return (
    <dl className="border-b border-line">
      {rows
        // Hide unfilled metafields (sample data uses "TODO")
        .filter(([, v]) => v && v.trim().toUpperCase() !== "TODO")
        .map(([label, value], i) => (
          <div key={label} className="grid grid-cols-[2.75rem_7.5rem_1fr] items-baseline border-t border-line py-4">
            <span className="ordinal">{String(i + 1).padStart(2, "0")}</span>
            <dt className="text-[11px] tracking-[0.18em] text-muted uppercase">{label}</dt>
            <dd className="text-[15px]">{value}</dd>
          </div>
        ))}
    </dl>
  );
}

async function PieceContent(props: PageProps<"/pieces/[handle]">) {
  const { handle } = await props.params;
  const piece = await getPiece(handle);
  if (!piece) notFound();

  const related = (await listPieces({ designer: piece.designer }))
    .filter((p) => p.handle !== piece.handle)
    .slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(piece)).replace(/</g, "\\u003c") }}
      />
      <nav aria-label="Breadcrumb" className="label mb-6 text-[10px] text-muted md:mb-10">
        <Link href="/shop" className="hover:text-ink">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/shop/${piece.category}`} className="hover:text-ink">
          {CATEGORY_LABELS[piece.category]}
        </Link>
      </nav>

      <div className="grid gap-10 md:grid-cols-[1.15fr_1fr] lg:gap-16">
        {/* Phones: swipeable gallery with a peek of the next photo. Desktop: stacked. */}
        <div className="-mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:-mx-8 sm:px-8 md:mx-0 md:grid md:gap-3 md:overflow-visible md:px-0">
          {piece.images.length > 0 ? (
            piece.images.map((image, i) => (
              <div key={image.url} className={`shrink-0 snap-center md:w-auto ${piece.images.length > 1 ? "w-[86%]" : "w-full"}`}>
                <PieceImage image={image} priority={i === 0} sizes="(min-width: 768px) 55vw, 86vw" />
              </div>
            ))
          ) : (
            <PieceImage sizes="100vw" label={piece.designer} />
          )}
        </div>

        <div className="md:sticky md:top-24 md:self-start">
          <p className="eyebrow">
            {CATEGORY_LABELS[piece.category]} · {piece.decade}
          </p>
          <h1 className="display-md mt-4">{piece.title}</h1>
          <div className="mt-6 flex items-baseline justify-between gap-4 border-y border-line py-4">
            <p className="text-[19px] tracking-[0.02em] tabular-nums">{piece.saleStatus === "sold" ? "Sold" : formatPrice(piece.price)}</p>
            <span className="label text-[10px] text-bronze">
              1 of 1 · {STATUS_LABELS[piece.saleStatus]}
            </span>
          </div>

          <div className="mt-8">
            <PurchaseAction handle={piece.handle} title={piece.title} status={piece.saleStatus} />
          </div>

          {/* Phones: the inquiry stays one thumb away while reading the details */}
          {piece.saleStatus === "available" && (
            <div className="sticky-cta fixed inset-x-0 bottom-0 z-30 border-t border-line bg-cream/95 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <span className="piece-name truncate text-[20px]">{piece.designer}</span>
                <span className="text-[14px] tabular-nums">{formatPrice(piece.price)}</span>
              </div>
              <PurchaseAction handle={piece.handle} title={piece.title} status={piece.saleStatus} />
            </div>
          )}

          <ul className="label mt-5 grid grid-cols-3 border-y border-line text-center text-[9.5px] leading-snug text-muted">
            {["Curated in Europe", "One of one", "Aram replies personally"].map((t, i) => (
              <li key={t} className={`flex items-center justify-center px-2 py-3 ${i ? "border-l border-line" : ""}`}>
                {t}
              </li>
            ))}
          </ul>

          <div
            className="mt-8 space-y-4 text-[16px] leading-relaxed text-ink/85"
            dangerouslySetInnerHTML={{ __html: piece.descriptionHtml }}
          />

          <div className="mt-10">
            <p className="eyebrow mb-4">The details</p>
            <Details piece={piece} />
          </div>

          <p className="mt-6 text-sm text-muted">
            Questions about shipping or care? See <Link href="/help" className="link-underline">Help</Link>.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <p data-reveal className="eyebrow mb-4">Same signature</p>
          <h2 data-reveal className="display-md mb-12">
            More from <span className="accent">{piece.designer}</span>
          </h2>
          <PieceGrid pieces={related} />
        </section>
      )}
    </>
  );
}

export default function PiecePage(props: PageProps<"/pieces/[handle]">) {
  return (
    <div className="container-site pt-8 md:pt-12">
      <Suspense
        fallback={
          <div className="flex min-h-[70svh] items-center justify-center">
            <SignatureLoader />
          </div>
        }
      >
        <PieceContent {...props} />
      </Suspense>
    </div>
  );
}
