import type { Metadata } from "next";
import { LaunchList } from "@/components/launch-list";
import { PieceGrid } from "@/components/piece-card";
import { listArchive } from "@/lib/catalog";
import { alternatesFor, getI18n } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t } = await getI18n();
  const pieces = await listArchive();
  return {
    title: t.meta.archive.title,
    description: t.meta.archive.description,
    alternates: alternatesFor(lang, "/archive"),
    // Not linked or indexed until something has sold (no empty sections, §7).
    robots: pieces.length ? undefined : { index: false },
  };
}

export default async function ArchivePage() {
  const { lang, t } = await getI18n();
  const pieces = await listArchive(lang);
  return (
    <>
      <div className="container-site pt-12 md:pt-16">
        <p className="eyebrow">{t.archive.eyebrow}</p>
        <h1 className="display-lg mt-3">{t.archive.title}</h1>
        <p className="mt-4 max-w-xl text-muted">{t.archive.body}</p>
        <div className="mt-12">
          {pieces.length > 0 ? (
            <PieceGrid pieces={pieces} priorityCount={4} headingLevel={2} />
          ) : (
            <p className="py-20 text-center accent text-2xl text-muted">{t.archive.empty}</p>
          )}
        </div>
      </div>
      <div className="mt-24 -mb-28">
        <LaunchList source="archive" />
      </div>
    </>
  );
}
