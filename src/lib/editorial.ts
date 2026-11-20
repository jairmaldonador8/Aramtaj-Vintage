import type { Lang } from "@/lib/i18n";

/**
 * Editorial imagery used outside the catalog (hero, Edit band, About).
 * All of it is Aram's own photography from her Drive (nov 2026), exported at
 * web size without EXIF/GPS. No AI-generated images ship (CLAUDE.md §10).
 */
interface EditorialImage {
  src: string;
  width: number;
  height: number;
  alt: Record<Lang, string>;
}

export const editorial = {
  // Hero: her professional session ("Homepage website Pictures").
  heroWide: {
    src: "/editorial/hero-wide.jpg",
    width: 2560,
    height: 1440,
    alt: {
      en: "Vintage gold-tone and crystal link necklace worn with a white blouse",
      es: "Collar vintage de eslabones en tono dorado con cristales, puesto con una blusa blanca",
    },
  },
  heroTall: {
    src: "/editorial/hero-tall.jpg",
    width: 1440,
    height: 2560,
    alt: {
      en: "Elizabeth Taylor for Avon cabochon earrings and pendant necklace, worn",
      es: "Aretes y collar con dije de cabujón Elizabeth Taylor for Avon, puestos",
    },
  },
  // "The current Edit" band (only shown when an Edit exists): IMG_1062 from her Drive (chosen nov 2026).
  editBand: {
    src: "/editorial/edit-band.jpg",
    width: 2400,
    height: 1600,
    alt: {
      en: "Vintage gold-tone necklaces, bracelets and clip earrings laid out in a jewelry box",
      es: "Collares, pulseras y aretes de clip vintage en tono dorado dentro de un joyero",
    },
  },
  // About page + home "Meet Aram": IMG_7056, her Media folder (chosen by Arturo, nov 2026).
  aram: {
    src: "/editorial/aram.jpg",
    width: 1200,
    height: 1600,
    alt: {
      en: "Aram Taj wearing a vintage pearl choker and pearl earrings",
      es: "Aram Taj con una gargantilla de perlas vintage y aretes de perla",
    },
  },
} satisfies Record<string, EditorialImage>;

/** The image fields only (for next/image `getImageProps`, which takes `alt` separately). */
export function imageOf({ src, width, height }: EditorialImage) {
  return { src, width, height };
}
