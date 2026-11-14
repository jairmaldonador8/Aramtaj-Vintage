import type { Metadata } from "next";
import Link from "next/link";
import { PieceGrid } from "@/components/piece-card";
import { getFacets, listPieces } from "@/lib/catalog";
import { slugify } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop by Designer",
  description: "Signed vintage jewelry by designer and decade. Every piece one of one, handpicked across Europe.",
  alternates: { canonical: "/designers" },
};

export default async function DesignersPage() {
  const [{ designers, decades }, pieces] = await Promise.all([getFacets(), listPieces()]);
  return (
    <div className="container-site pt-12 md:pt-16">
      <p className="eyebrow">The signature is the filter</p>
      <h1 className="display-lg mt-3">Designers</h1>

      <nav aria-label="Designers" className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-y border-line py-6">
        {designers.map((d) => (
          <a key={d} href={`#${slugify(d)}`} className="accent text-2xl hover:text-bronze">
            {d}
          </a>
        ))}
      </nav>

      {decades.length > 1 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-2">By decade</span>
          {decades.map((d) => (
            <Link
              key={d}
              href={`/shop?decade=${encodeURIComponent(d)}`}
              className="inline-flex min-h-9 items-center border border-line px-3 text-xs hover:border-ink"
            >
              {d}
            </Link>
          ))}
        </div>
      )}

      {designers.map((designer) => {
        const own = pieces.filter((p) => p.designer === designer);
        return (
          <section key={designer} id={slugify(designer)} className="mt-20 scroll-mt-24">
            <div className="mb-8 flex items-end justify-between gap-6">
              <h2 className="display-md">{designer}</h2>
              <Link
                href={`/shop?designer=${encodeURIComponent(designer)}`}
                className="link-underline shrink-0 text-xs tracking-[0.14em] uppercase"
              >
                {own.length} {own.length === 1 ? "piece" : "pieces"}
              </Link>
            </div>
            {/* TODO: short designer bio (house history, signature marks) */}
            <PieceGrid pieces={own.slice(0, 4)} />
          </section>
        );
      })}
    </div>
  );
}
