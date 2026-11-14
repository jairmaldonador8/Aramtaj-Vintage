import Image from "next/image";
import { ISOTIPO_PATHS, ISOTIPO_VIEWBOX } from "@/components/brand-paths";

/*
 * Brand marks. The isotipo is inline SVG (vector, currentColor) so it stays
 * razor-sharp at any size/density and its color can animate.
 * The full logo is the vector master served from /public/brand.
 */

const LOGO_RATIO = 1947.97 / 565.03;
export const ISOTIPO_RATIO = 2713.5 / 2561;

export function IsotipoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox={ISOTIPO_VIEWBOX}
      fill="currentColor"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      shapeRendering="geometricPrecision"
    >
      {ISOTIPO_PATHS.map((d, i) => (
        <path key={i} d={d} fillRule="evenodd" />
      ))}
    </svg>
  );
}

export function Logo({
  height = 80,
  tone = "arena",
  className,
}: {
  height?: number;
  tone?: "arena" | "marfil";
  className?: string;
}) {
  return (
    <Image
      src={`/brand/aramtaj-logo-${tone}.svg`}
      alt="Aram Taj Vintage Bijoux"
      width={Math.round(height * LOGO_RATIO)}
      height={height}
      unoptimized
      className={className}
    />
  );
}
