import type { Category } from "@/lib/catalog/types";
import type { Dict } from "@/lib/dictionary";

export const site = {
  name: "Aram Taj Vintage",
  shortName: "Aram Taj",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  instagram: "https://www.instagram.com/vintagebijouxbyaramtaj/",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
};

export const CATEGORY_ORDER: Category[] = ["necklaces", "earrings", "bracelets", "rings", "brooches"];

/** Paths without locale; labels come from the dictionary (t.nav[key]). */
export const NAV: { path: string; key: keyof Dict["nav"] }[] = [
  { path: "/shop", key: "shop" },
  { path: "/designers", key: "designers" },
  { path: "/archive", key: "archive" },
  { path: "/about", key: "about" },
  { path: "/help", key: "help" },
];

/** Main navigation, hiding the Archive until something has sold. */
export const navItems = (showArchive: boolean) => NAV.filter((n) => showArchive || n.path !== "/archive");

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function whatsappLink(message: string): string {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
