import Link from "next/link";
import { PieceImage } from "@/components/piece-image";
import { Price } from "@/components/price";
import type { Piece } from "@/lib/catalog/types";
import { decadeLabel, localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/locale-server";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Card in the slide's order: number + designer-first title, then a hairline,
 * then the facts with the price aligned right. Titles are already designer-first,
 * so the facts line only repeats the designer when the title doesn't start with it.
 */
export async function PieceCard({
  piece,
  index,
  priority,
  headingLevel = 3,
}: {
  piece: Piece;
  index?: number;
  priority?: boolean;
  /** 2 when the grid follows the page's h1 directly (Shop, Archive); 3 under a section h2. */
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const { lang, t } = await getI18n();
  const sold = piece.saleStatus === "sold";
  const showDesigner = piece.designer && !piece.title.toLowerCase().startsWith(piece.designer.toLowerCase());
  const facts = [showDesigner ? piece.designer : "", decadeLabel(piece.decade, lang)].filter(Boolean).join(" · ");
  return (
    <Link href={localePath(lang, `/pieces/${piece.handle}`)} className="group block">
      <div className="relative">
        <PieceImage
          image={piece.images[0]}
          hoverImage={piece.images[1]}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          priority={priority}
          label={piece.designer}
        />
        {piece.saleStatus !== "available" && (
          <span className="label absolute top-3 left-3 bg-cream/95 px-2.5 py-1.5 text-[9.5px]">
            {t.status[piece.saleStatus]}
          </span>
        )}
      </div>
      <div className="mt-4 grid grid-cols-[1.9rem_minmax(0,1fr)] gap-y-2.5">
        {index !== undefined && <span className="ordinal pt-[2px]">{pad(index + 1)}</span>}
        <Heading
          className={`piece-name line-clamp-3 transition-colors duration-500 group-hover:text-bronze ${
            index === undefined ? "col-span-2" : ""
          }`}
        >
          {piece.title}
        </Heading>
        <div className="col-span-2 flex flex-col gap-1 border-t border-line pt-2.5 text-[13px] sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
          <span className="truncate tracking-[0.02em] text-muted">{facts}</span>
          {sold ? (
            <span className="shrink-0 tracking-[0.04em] text-muted">{t.status.sold}</span>
          ) : (
            <Price price={piece.price} className="shrink-0 tracking-[0.02em]" />
          )}
        </div>
      </div>
    </Link>
  );
}

export function PieceGrid({
  pieces,
  priorityCount = 0,
  numbered = true,
  headingLevel = 3,
}: {
  pieces: Piece[];
  /** First cards are above the fold: loaded first and shown without the reveal fade (faster LCP). */
  priorityCount?: number;
  numbered?: boolean;
  headingLevel?: 2 | 3;
}) {
  return (
    <ul className="grid grid-cols-2 gap-x-3.5 gap-y-12 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-20">
      {pieces.map((piece, i) => (
        // Stagger within a row: 2 cols on phones, up to 4 on desktop.
        <li key={piece.id} data-reveal={i < priorityCount ? undefined : ""} style={{ ["--i" as string]: i % 4 }}>
          <PieceCard
            piece={piece}
            index={numbered ? i : undefined}
            priority={i < priorityCount}
            headingLevel={headingLevel}
          />
        </li>
      ))}
    </ul>
  );
}
