import type { Metadata } from "next";
import Link from "next/link";
import { PieceGrid } from "@/components/piece-card";
import { getFacets, listPieces } from "@/lib/catalog";
import { localePath } from "@/lib/i18n";
import { alternatesFor, getI18n } from "@/lib/locale-server";
import { slugify } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t } = await getI18n();
  return { title: t.meta.designers.title, description: t.meta.designers.description, alternates: alternatesFor(lang, "/designers") };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default async function DesignersPage() {
  const { lang, t } = await getI18n();
  const [{ designers }, pieces] = await Promise.all([getFacets(), listPieces({}, lang)]);
  const byDesigner = new Map(designers.map((d) => [d, pieces.filter((p) => p.designer === d)]));
  // Houses with several pieces get their own section; single pieces share one grid.
  const houses = designers.filter((d) => (byDesigner.get(d)?.length ?? 0) > 1);
  const singles = designers.filter((d) => byDesigner.get(d)?.length === 1);
  const singlePieces = singles.flatMap((d) => byDesigner.get(d) ?? []);

  return (
    <div className="container-site pt-12 md:pt-16">
      <p className="eyebrow">{t.designers.eyebrow}</p>
      <h1 className="display-lg mt-3">{t.designers.title}</h1>

      {/* Index: numbered A–Z list in columns, hairline-separated, with piece counts */}
      <nav aria-label="Designers" className="mt-10 border-t border-line sm:columns-2 sm:gap-x-12 lg:columns-3">
        {designers.map((d, i) => {
          const own = byDesigner.get(d) ?? [];
          const href = own.length > 1 ? `#${slugify(d)}` : localePath(lang, `/pieces/${own[0]?.handle}`);
          return (
            <Link
              key={d}
              href={href}
              className="group grid break-inside-avoid grid-cols-[2.25rem_1fr_auto] items-baseline border-b border-line py-3.5"
            >
              <span className="ordinal">{pad(i + 1)}</span>
              <span className="piece-name text-[21px] transition-colors duration-500 group-hover:text-bronze">{d}</span>
              <span className="text-[11px] tracking-[0.12em] text-muted tabular-nums">{own.length}</span>
            </Link>
          );
        })}
      </nav>

      {houses.map((designer) => {
        const own = byDesigner.get(designer) ?? [];
        return (
          <section key={designer} id={slugify(designer)} className="mt-20 scroll-mt-24 md:mt-28">
            <div className="mb-8 flex items-end justify-between gap-6 border-b border-line pb-4">
              <h2 className="display-md">{designer}</h2>
              <Link
                href={`${localePath(lang, "/shop")}?designer=${encodeURIComponent(designer)}`}
                className="link-underline shrink-0 text-xs tracking-[0.14em] uppercase"
              >
                {own.length > 4 ? t.designers.viewAll(own.length) : t.designers.pieces(own.length)}
              </Link>
            </div>
            {/* TODO: short designer bio (house history, signature marks) */}
            <PieceGrid pieces={own.slice(0, 4)} />
          </section>
        );
      })}

      {singlePieces.length > 0 && (
        <section id="more-signatures" className="mt-20 scroll-mt-24 md:mt-28">
          <div className="mb-8 border-b border-line pb-4">
            <p className="eyebrow mb-3">{t.designers.singlesEyebrow}</p>
            <h2 className="display-md">
              {t.designers.singlesTitle[0]} <span className="accent">{t.designers.singlesTitle[1]}</span>
            </h2>
          </div>
          <PieceGrid pieces={singlePieces} />
        </section>
      )}
    </div>
  );
}
