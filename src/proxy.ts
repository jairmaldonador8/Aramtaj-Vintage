import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LANG, hasLocale, LOCALE_COOKIE, type Lang } from "@/lib/i18n";

/**
 * Every page lives under /en or /es. A URL without a locale ("/", "/shop/rings")
 * is redirected to the visitor's language: the saved choice (cookie set by the
 * EN/ES switcher), else the browser's Accept-Language, else English.
 */
function preferredLang(request: NextRequest): Lang {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && hasLocale(saved)) return saved;
  const accept = request.headers.get("accept-language") ?? "";
  const first = accept
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q)
    .find(({ tag }) => tag.startsWith("es") || tag.startsWith("en"));
  return first?.tag.startsWith("es") ? "es" : DEFAULT_LANG;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segment = pathname.split("/")[1] ?? "";
  if (hasLocale(segment)) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLang(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip Next internals, API routes and any file with an extension (images, icons, robots.txt, sitemap.xml…)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
