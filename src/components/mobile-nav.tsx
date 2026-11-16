"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useI18n } from "@/components/providers";
import { CurrencySwitcher, LocaleSwitcher } from "@/components/switchers";
import { localePath } from "@/lib/i18n";
import { navItems, site, whatsappLink } from "@/lib/site";

export function MobileNav({ showArchive }: { showArchive: boolean }) {
  const { lang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const root = document.documentElement;
    document.body.style.overflow = open ? "hidden" : "";
    if (open) root.setAttribute("data-menu-open", "");
    else root.removeAttribute("data-menu-open");
    return () => {
      document.body.style.overflow = "";
      root.removeAttribute("data-menu-open");
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
        className="-ml-2 flex size-11 flex-col items-start justify-center gap-[7px] pl-2"
      >
        <span
          className={`h-px w-6 bg-current transition-transform duration-500 ease-[var(--ease-lux)] ${open ? "translate-y-[4px] rotate-45" : ""}`}
        />
        <span
          className={`h-px bg-current transition-all duration-500 ease-[var(--ease-lux)] ${open ? "w-6 -translate-y-[4px] -rotate-45" : "w-4"}`}
        />
      </button>
      <nav
        id="mobile-menu"
        aria-label="Main"
        aria-hidden={!open}
        inert={!open}
        className={`absolute inset-x-0 top-full z-50 flex h-[calc(100dvh-var(--header-h))] flex-col overflow-y-auto border-t border-line bg-cream px-5 pt-4 pb-10 text-ink transition-[opacity,transform] duration-500 ease-[var(--ease-lux)] ${
          open ? "opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        <ul className="border-b border-line">
          {navItems(showArchive).map((item, i) => (
            <li
              key={item.path}
              className="border-t border-line transition-[opacity,transform] duration-700 ease-[var(--ease-lux)]"
              style={{
                transitionDelay: open ? `${80 + i * 60}ms` : "0ms",
                opacity: open ? 1 : 0,
                transform: open ? "none" : "translateY(12px)",
              }}
            >
              <Link href={localePath(lang, item.path)} className="flex items-baseline gap-4 py-5">
                <span className="ordinal">{String(i + 1).padStart(2, "0")}</span>
                <span className="display text-[34px] font-light">{t.nav[item.key]}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex items-center justify-between border-b border-line pb-4">
          <LocaleSwitcher />
          <CurrencySwitcher />
        </div>
        <div className="mt-auto pt-10">
          <p className="eyebrow">{t.nav.askAram}</p>
          <a
            href={whatsappLink(t.whatsapp.general)}
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-4 w-full"
            hidden={!site.whatsappNumber}
          >
            {t.nav.messageWhatsApp}
          </a>
        </div>
      </nav>
    </div>
  );
}
