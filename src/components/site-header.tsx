"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignatureMark } from "@/components/signature-mark";
import { MobileNav } from "@/components/mobile-nav";
import { NAV } from "@/lib/site";

/**
 * Header with the isotipo centered. On the home page the header floats
 * transparent over the hero; as you scroll, the big hero mark dissolves
 * and this one signs itself (see <HeroScroll>).
 */
export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const current = (href: string) => (pathname === href || pathname.startsWith(href + "/") ? "page" : undefined);
  return (
    <header
      className="site-header sticky top-0 z-40"
      // Home starts clear over the hero (before <HeroScroll> takes over); other pages solid.
      style={{ ["--hp-default" as string]: isHome ? 0 : 1 }}
    >
      <div className="container-site grid h-[var(--header-h)] grid-cols-[1fr_auto_1fr] items-center gap-6">
        <div className="flex items-center">
          <MobileNav />
          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-10">
              {NAV.slice(0, 3).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="nav-link" aria-current={current(item.href)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <Link
          href="/"
          id="brand-slot"
          aria-label="Aram Taj, home"
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
        <nav aria-label="Secondary" className="hidden justify-self-end md:block">
          {/* Step 2: cart button goes here. */}
          <ul className="flex items-center gap-10">
            {NAV.slice(3).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-link" aria-current={current(item.href)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
