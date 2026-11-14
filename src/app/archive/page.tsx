import type { Metadata } from "next";
import { LaunchList } from "@/components/launch-list";
import { PieceGrid } from "@/components/piece-card";
import { listArchive } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "The Archive — Sold Pieces",
  description: "A record of signed vintage pieces that have found their new home. Join the list for the next Edit.",
  alternates: { canonical: "/archive" },
};

export default async function ArchivePage() {
  const pieces = await listArchive();
  return (
    <>
      <div className="container-site pt-12 md:pt-16">
        <p className="eyebrow">Found a new home</p>
        <h1 className="display-lg mt-3">The Archive</h1>
        <p className="mt-4 max-w-xl text-muted">
          Every piece is one of one. These have been sold — if you love one, ask Aram for something similar from the
          next Edit.
        </p>
        <div className="mt-12">
          {pieces.length > 0 ? (
            <PieceGrid pieces={pieces} />
          ) : (
            <p className="py-20 text-center accent text-2xl text-muted">The Archive is just beginning.</p>
          )}
        </div>
      </div>
      <div className="mt-24 -mb-28">
        <LaunchList />
      </div>
    </>
  );
}
