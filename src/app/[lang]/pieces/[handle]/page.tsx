import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PieceGrid } from "@/components/piece-card";
import { PieceImage } from "@/components/piece-image";
import { Price, PriceNote } from "@/components/price";
import { PurchaseAction, StickyInquiry } from "@/components/purchase-action";
import { SignatureLoader } from "@/components/signature-mark";
import { CurrencySwitcher } from "@/components/switchers";
import { getPiece, listAllHandles, listPieces } from "@/lib/catalog";
import type { Piece } from "@/lib/catalog/types";
import type { Dict } from "@/lib/dictionary";
import { decadeLabel, localePath, type Lang } from "@/lib/i18n";
import { alternatesFor, getI18n } from "@/lib/locale-server";
import { site } from "@/lib/site";

export async function generateStaticParams() {
  const handles = await listAllHandles();
  return handles.map((handle) => ({ handle }));
}

function plainText(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata(props: PageProps<"/[lang]/pieces/[handle]">): Promise<Metadata> {
  const { handle } = await props.params;
  const { lang, t } = await getI18n();
  const piece = await getPiece(handle, lang);
  if (!piece) return {};
  const decade = decadeLabel(piece.decade, lang);
  const description = plainText(piece.descriptionHtml).slice(0, 155) || t.meta.piece(piece.designer, decade);
  return {
    title: decade ? `${piece.title} — ${decade}` : piece.title,
    description,
    alternates: alternatesFor(lang, `/pieces/${piece.handle}`),
    openGraph: {
      title: piece.title,
      description,
      images: piece.images.slice(0, 1).map((i) => ({ url: i.url, width: i.width, height: i.height, alt: i.alt })),
    },
    robots: piece.isSample ? { index: false } : undefined,
  };
}

function productJsonLd(piece: Piece, lang: Lang) {
  const availability = {
    available: "https://schema.org/InStock",
    reserved: "https://schema.org/LimitedAvailability",
    sold: "https://schema.org/SoldOut",
  }[piece.saleStatus];
  const url = `${site.url}${localePath(lang, `/pieces/${piece.handle}`)}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: piece.title,
    description: plainText(piece.descriptionHtml),
    image: piece.images.map((i) => i.url),
    ...(piece.designer && { brand: { "@type": "Brand", name: piece.designer } }),
    itemCondition: "https://schema.org/UsedCondition",
    url,
    ...(piece.price && {
      offers: {
        "@type": "Offer",
        price: piece.price.amount,
        priceCurrency: piece.price.currencyCode,
        availability,
        url,
      },
    }),
  };
}

function Details({ piece, lang, t }: { piece: Piece; lang: Lang; t: Dict }) {
  const L = t.piece.labels;
  const rows: [string, string | undefined][] = [
    [L.designer, piece.designer],
    [L.decade, decadeLabel(piece.decade, lang)],
    [L.origin, piece.origin],
    [L.materials, piece.materials],
    [L.condition, piece.condition],
    [L.measurements, piece.measurements],
    [L.clasp, piece.clasp],
    [L.earringType, piece.earringType && t.earring[piece.earringType]],
  ];
  return (
    <dl className="border-b border-line">
      {rows
        // Hide unfilled metafields
        .filter(([, v]) => v && v.trim().toUpperCase() !== "TODO")
        .map(([label, value], i) => (
          <div key={label} className="grid grid-cols-[2.25rem_7.5rem_1fr] items-baseline border-t border-line py-4">
            <span className="ordinal">{String(i + 1).padStart(2, "0")}</span>
            <dt className="text-[11px] tracking-[0.16em] text-muted uppercase">{label}</dt>
            <dd className="text-[15px]">{value}</dd>
          </div>
        ))}
    </dl>
  );
}

async function PieceContent(props: PageProps<"/[lang]/pieces/[handle]">) {
  const { handle } = await props.params;
  const { lang, t } = await getI18n();
  const piece = await getPiece(handle, lang);
  if (!piece) notFound();

  // Pieces without an identified designer have no "same signature" row.
  const related = piece.designer
    ? (await listPieces({ designer: piece.designer }, lang)).filter((p) => p.handle !== piece.handle).slice(0, 4)
    : [];
  const crumb = "inline-flex min-h-10 items-center hover:text-ink";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(piece, lang)).replace(/</g, "\\u003c") }}
      />
      <nav aria-label="Breadcrumb" className="label mb-3 text-[10.5px] text-muted md:mb-8">
        <Link href={localePath(lang, "/shop")} className={crumb}>
          {t.piece.shop}
        </Link>
        <span className="mx-2">/</span>
        <Link href={localePath(lang, `/shop/${piece.category}`)} className={crumb}>
          {t.categories[piece.category]}
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
            {[t.categories[piece.category], decadeLabel(piece.decade, lang)].filter(Boolean).join(" · ")}
          </p>
          <h1 className="display-md mt-4">{piece.title}</h1>
          <div className="mt-6 flex items-center justify-between gap-4 border-y border-line py-3">
            <p className="text-[19px] tracking-[0.02em]">
              {piece.saleStatus === "sold" ? t.status.sold : <Price price={piece.price} />}
            </p>
            <div className="flex items-center gap-4">
              <span className="label hidden text-[10px] text-bronze sm:inline">
                {t.piece.oneOfOne} · {t.status[piece.saleStatus]}
              </span>
              {piece.saleStatus !== "sold" && (
                <span className="text-muted">
                  <CurrencySwitcher />
                </span>
              )}
            </div>
          </div>
          <PriceNote className="mt-2 text-[12px] leading-snug text-muted" />

          <div className="mt-7">
            <PurchaseAction id="primary-cta" handle={piece.handle} title={piece.title} status={piece.saleStatus} />
          </div>

          {piece.saleStatus === "available" && (
            <StickyInquiry
              targetId="primary-cta"
              handle={piece.handle}
              title={piece.title}
              label={piece.designer || t.categories[piece.category]}
              price={piece.price}
            />
          )}

          <ul className="label mt-5 grid grid-cols-3 border-y border-line text-center text-[10px] leading-snug text-muted">
            {t.piece.trust.map((label, i) => (
              <li key={label} className={`flex items-center justify-center px-2 py-3 ${i ? "border-l border-line" : ""}`}>
                {label}
              </li>
            ))}
          </ul>

          <div
            className="mt-8 space-y-4 text-[16px] leading-relaxed text-ink/85"
            dangerouslySetInnerHTML={{ __html: piece.descriptionHtml }}
          />

          <div className="mt-10">
            <p className="eyebrow mb-4">{t.piece.details}</p>
            <Details piece={piece} lang={lang} t={t} />
          </div>

          <p className="mt-6 text-sm text-muted">
            {t.piece.questions}{" "}
            <Link href={localePath(lang, "/help")} className="link-underline">
              {t.piece.help}
            </Link>
            .
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <p data-reveal className="eyebrow mb-4">
            {t.piece.sameSignature}
          </p>
          <h2 data-reveal className="display-md mb-12">
            {t.piece.moreFrom} <span className="accent">{piece.designer}</span>
          </h2>
          <PieceGrid pieces={related} />
        </section>
      )}
    </>
  );
}

export default function PiecePage(props: PageProps<"/[lang]/pieces/[handle]">) {
  return (
    <div className="container-site pt-6 md:pt-12">
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
