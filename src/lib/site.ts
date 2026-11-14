import type { Category, EarringType, Money, SaleStatus } from "@/lib/catalog/types";

export const site = {
  name: "Aram Taj Vintage",
  shortName: "Aram Taj",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  description:
    "Signed vintage costume jewelry from the 1960s to the 1990s, handpicked across Europe. Every piece is one of one.",
  instagram: "https://www.instagram.com/", // TODO: Aram's Instagram handle
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
};

export const CATEGORY_LABELS: Record<Category, string> = {
  necklaces: "Necklaces",
  earrings: "Earrings",
  bracelets: "Bracelets",
  rings: "Rings",
  brooches: "Brooches",
};

export const CATEGORY_ORDER: Category[] = ["necklaces", "earrings", "bracelets", "rings", "brooches"];

export const EARRING_LABELS: Record<EarringType, string> = {
  clip: "Clip-on",
  pierced: "Pierced",
};

export const STATUS_LABELS: Record<SaleStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
};

export const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/designers", label: "Designers" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About Aram" },
  { href: "/help", label: "Help" },
] as const;

export function formatPrice(price: Money | null): string {
  if (!price) return "Price on request";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currencyCode,
    maximumFractionDigits: 0,
  }).format(price.amount);
}

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
