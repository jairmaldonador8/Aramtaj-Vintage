/**
 * Editorial imagery used outside the catalog (hero, bands, About).
 *
 * Hero (heroWide / heroTall) and About portrait (aram) are Aram's own photos
 * from her Media folder (nov 2026), exported at web size without EXIF/GPS.
 *
 * TODO: velvet (Edit band, only shown when an Edit exists) and atelier are still
 * AI-generated PLACEHOLDERS (Higgsfield) — replace before launch.
 */
export const editorial = {
  heroWide: {
    src: "/editorial/hero-wide.jpg",
    width: 2560,
    height: 1440,
    alt: "Vintage gold-tone and crystal link necklace worn with a white blouse",
  },
  heroTall: {
    src: "/editorial/hero-tall.jpg",
    width: 1440,
    height: 2560,
    alt: "Elizabeth Taylor for Avon cabochon earrings and pendant necklace, worn",
  },
  velvet: {
    src: "/placeholder/velvet.jpg",
    width: 1024,
    height: 688,
    alt: "Vintage necklaces, brooch, cuff and clip earrings arranged on burgundy velvet",
  },
  atelier: {
    src: "/placeholder/atelier.jpg",
    width: 896,
    height: 1120,
    alt: "Hands inspecting a vintage gold-tone pearl brooch with a jeweler’s loupe",
  },
  // About page + home "Meet Aram": Aram's own photo (IMG_7056, her Media folder; chosen by Arturo, nov 2026).
  aram: {
    src: "/editorial/aram.jpg",
    width: 1200,
    height: 1600,
    alt: "Aram Taj wearing a vintage pearl choker and pearl earrings",
  },
} as const;
