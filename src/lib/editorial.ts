/**
 * Editorial imagery used outside the catalog (hero, bands, About).
 *
 * Hero follows the Brand Lab “Bodegón” direction (onyx, wine velvet, gold).
 *
 * TODO: these are AI-generated PLACEHOLDERS (Higgsfield, nov 2026) so the
 * layout can be reviewed. Replace with Aram's own photos/videos from the
 * Media folder before launch — same keys, same aspect ratios.
 */
export const editorial = {
  heroWide: {
    src: "/placeholder/velvet-hero-wide.jpg",
    width: 2688,
    height: 1520,
    alt: "Vintage gold collar with amber crystals on wine velvet, with an antique hand mirror and jewelry box by candlelight",
  },
  heroTall: {
    src: "/placeholder/velvet-hero-tall.jpg",
    width: 1520,
    height: 2688,
    alt: "Vintage gold collar with amber crystals on wine velvet by candlelight",
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
} as const;
