"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignatureMark } from "@/components/signature-mark";
import { MobileNav } from "@/components/mobile-nav";
import { useI18n } from "@/components/providers";
import { CurrencySwitcher, LocaleSwitcher } from "@/components/switchers";
import { localePath, stripLocale } from "@/lib/i18n";
import { navItems } from "@/lib/site";

/**
 * Header with the isotipo centered. On the home page the header floats
 * transparent over the hero; as you scroll, the big hero mark dissolves
 * and this one signs itself (see <HeroScroll>).
 */
export function SiteHeader({ showArchive }: { showArchive: boolean }) {
  const { lang, t } = useI18n();
  const pathname = usePathname();
  const path = stripLocale(pathname);
  const isHome = path === "/";
  const current = (p: string) => (path === p || path.startsWith(p + "/") ? "page" : undefined);
  const items = navItems(showArchive);
  const left = items.filter((n) => ["/shop", "/designers", "/archive"].includes(n.path));
  const right = items.filter((n) => !left.includes(n));
  return (
    <header
      className="site-header sticky top-0 z-40"
      // Home starts clear over the hero (before <HeroScroll> takes over); other pages solid.
      style={{ ["--hp-default" as string]: isHome ? 0 : 1 }}
    >
      <div className="container-site grid h-[var(--header-h)] grid-cols-[1fr_auto_1fr] items-center gap-6">
        <div className="flex items-center">
          <MobileNav showArchive={showArchive} />
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-10">
              {left.map((item) => (
                <li key={item.path}>
                  <Link href={localePath(lang, item.path)} className="nav-link" aria-current={current(item.path)}>
                    {t.nav[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <Link
          href={localePath(lang)}
          id="brand-slot"
          aria-label={t.nav.home}
          className="flex h-9 w-[2.4rem] items-center justify-center justify-self-center md:h-11 md:w-[2.9rem]"
        >
          {/* On home the mark waits until the hero mark dissolves, then signs itself. */}
          <SignatureMark
            uid="nav"
            variant="nav"
            title="Aram Taj"
            className={`nav-mark h-full w-auto ${isHome ? "nav-mark-home" : ""}`}
          />
        </Link>
        <div className="flex items-center justify-self-end gap-8">
          <nav aria-label="Secondary" className="hidden md:block">
            {/* Step 2: cart button goes here. */}
            <ul className="flex items-center gap-10">
              {right.map((item) => (
                <li key={item.path}>
                  <Link href={localePath(lang, item.path)} className="nav-link" aria-current={current(item.path)}>
                    {t.nav[item.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="-mr-1 flex items-center gap-3 md:gap-4">
            <LocaleSwitcher />
            <span className="hidden md:contents">
              <CurrencySwitcher />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
