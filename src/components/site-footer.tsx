import Link from "next/link";
import { IsotipoMark, Logo } from "@/components/brand";
import { localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/locale-server";
import { navItems, site } from "@/lib/site";

export async function SiteFooter({ showArchive }: { showArchive: boolean }) {
  const { lang, t } = await getI18n();
  return (
    <footer className="mt-28 bg-onyx text-cream">
      <div className="container-site grid gap-14 py-20 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo height={64} className="h-14 w-auto" />
          <p className="mt-6 text-sm leading-relaxed text-cream/60">{t.meta.description}</p>
        </div>
        <nav aria-label="Footer">
          <p className="eyebrow text-arena">{t.footer.explore}</p>
          <ul className="mt-5 divide-y divide-cream/10 border-y border-cream/10 text-sm">
            {navItems(showArchive).map((item) => (
              <li key={item.path}>
                <Link href={localePath(lang, item.path)} className="block py-3 text-cream/80 hover:text-cream">
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="eyebrow text-arena">{t.footer.contact}</p>
          <ul className="mt-5 divide-y divide-cream/10 border-y border-cream/10 text-sm">
            <li>
              <a href={site.instagram} className="block py-3 text-cream/80 hover:text-cream" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${site.whatsappNumber}`}
                className="block py-3 text-cream/80 hover:text-cream"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10">
        <div className="container-site flex items-center justify-between gap-6 py-6">
          <p className="text-[11px] tracking-[0.16em] text-cream/50 uppercase">© {site.name}</p>
          <IsotipoMark className="h-8 w-auto text-arena" title="Aram Taj" />
        </div>
      </div>
    </footer>
  );
}
