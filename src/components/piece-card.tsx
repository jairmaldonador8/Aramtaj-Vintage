import Link from "next/link";
import { PieceImage } from "@/components/piece-image";
import type { Piece } from "@/lib/catalog/types";
import { formatPrice, STATUS_LABELS } from "@/lib/site";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Card in the slide's order: number + designer-first title, then a hairline,
 * then the facts (designer · decade) with the price aligned right.
 */
export function PieceCard({ piece, index, priority }: { piece: Piece; index?: number; priority?: boolean }) {
  const sold = piece.saleStatus === "sold";
  return (
    <Link href={`/pieces/${piece.handle}`} className="group block">
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
            {STATUS_LABELS[piece.saleStatus]}
          </span>
        )}
      </div>
      <div className="mt-4 grid grid-cols-[1.9rem_1fr] gap-y-2.5">
        {index !== undefined && <span className="ordinal pt-[2px]">{pad(index + 1)}</span>}
        <h3
          className={`piece-name transition-colors duration-500 group-hover:text-bronze ${
            index === undefined ? "col-span-2" : ""
          }`}
        >
          {piece.title}
        </h3>
        <div className="col-span-2 flex flex-col gap-0.5 border-t border-line pt-2.5 text-[12.5px] sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
          <span className="truncate tracking-[0.02em] text-muted">
            {piece.designer} · {piece.decade}
          </span>
          <span className={`shrink-0 tracking-[0.04em] tabular-nums ${sold ? "text-muted" : ""}`}>
            {sold ? "Sold" : formatPrice(piece.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function PieceGrid({
  pieces,
  priorityCount = 0,
  numbered = true,
}: {
  pieces: Piece[];
  priorityCount?: number;
  numbered?: boolean;
}) {
  return (
    <ul className="grid grid-cols-2 gap-x-3.5 gap-y-12 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-20">
      {pieces.map((piece, i) => (
        // Stagger within a row: 2 cols on phones, up to 4 on desktop.
        <li key={piece.id} data-reveal style={{ ["--i" as string]: i % 4 }}>
          <PieceCard piece={piece} index={numbered ? i : undefined} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
