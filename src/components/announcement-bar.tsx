import Link from "next/link";
import { localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/locale-server";

export async function AnnouncementBar() {
  const { lang, t } = await getI18n();
  return (
    <div className="bg-ink text-cream">
      <p className="container-site flex min-h-9 flex-wrap items-center justify-center gap-x-3 gap-y-0 py-1 text-center text-[10.5px] font-medium tracking-[0.16em] uppercase sm:text-[11px]">
        <span>{t.announcement.whatsapp}</span>
        <span aria-hidden className="text-arena">·</span>
        <span>{t.announcement.usa}</span>
        <span aria-hidden className="text-arena">·</span>
        <Link
          href={`${localePath(lang)}#launch-list`}
          className="-my-1 inline-flex min-h-9 items-center px-1 text-arena underline-offset-4 hover:underline"
        >
          {t.announcement.join}
        </Link>
      </p>
    </div>
  );
}
