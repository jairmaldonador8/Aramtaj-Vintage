import Link from "next/link";

export function AnnouncementBar() {
  return (
    <div className="bg-ink text-cream">
      <p className="container-site flex min-h-9 flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center text-[10px] font-medium tracking-[0.18em] uppercase sm:text-[11px]">
        <span>Now available via WhatsApp</span>
        <span aria-hidden className="text-arena">·</span>
        <span>Launching in the USA soon</span>
        <span aria-hidden className="text-arena">·</span>
        <Link href="/#launch-list" className="text-arena underline-offset-4 hover:underline">
          Join the list
        </Link>
      </p>
    </div>
  );
}
