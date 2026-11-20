import Link from "next/link";
import { localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/locale-server";

export default async function NotFound() {
  const { lang, t } = await getI18n();
  return (
    <div className="container-site py-32 text-center">
      <p className="eyebrow">{t.notFound.eyebrow}</p>
      <h1 className="display-lg mt-4">{t.notFound.title}</h1>
      <p className="mt-4 text-muted">{t.notFound.body}</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href={localePath(lang, "/shop")} className="btn-primary">
          {t.notFound.shop}
        </Link>
      </div>
    </div>
  );
}
