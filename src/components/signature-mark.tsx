import { ISOTIPO_PATHS, ISOTIPO_VIEWBOX } from "@/components/brand-paths";

const [VX, VY, VW, VH] = ISOTIPO_VIEWBOX.split(" ").map(Number);

/**
 * The AT isotipo with its "signature" animation, in pure CSS (see the
 * `.sig-*` rules in globals.css):
 *   1. a hairline traces the monogram like a pen signature,
 *   2. the gold fills in as the hairline dissolves,
 *   3. a band of light sweeps across the metal.
 *
 * Variants:
 *   hero   — plays once on load (large, center of the home hero)
 *   nav    — plays when <html data-nav-mark> is set (header, home page)
 *   loader — loops (small, centered loading screens)
 *   transition — plays once each time it mounts (page transition curtain)
 *
 * `uid` must be unique per instance on the page (gradient/clip ids).
 */
export function SignatureMark({
  uid,
  variant,
  className = "",
  title,
}: {
  uid: string;
  variant: "hero" | "nav" | "loader" | "transition";
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox={ISOTIPO_VIEWBOX}
      className={`sig sig-${variant} overflow-visible ${className}`}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      shapeRendering="geometricPrecision"
    >
      <defs>
        <linearGradient id={`sig-sheen-${uid}`} x1="0" y1="0" x2="1" y2="0.22">
          <stop offset="0.36" stopColor="#fff7e6" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff7e6" stopOpacity="0.85" />
          <stop offset="0.64" stopColor="#fff7e6" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`sig-clip-${uid}`}>
          {ISOTIPO_PATHS.map((d, i) => (
            <path key={i} d={d} clipRule="evenodd" />
          ))}
        </clipPath>
      </defs>
      {ISOTIPO_PATHS.map((d, i) => (
        <path key={`s${i}`} d={d} className="sig-stroke" pathLength={1} vectorEffect="non-scaling-stroke" />
      ))}
      {ISOTIPO_PATHS.map((d, i) => (
        <path key={`f${i}`} d={d} className="sig-fill" fillRule="evenodd" />
      ))}
      <g clipPath={`url(#sig-clip-${uid})`}>
        <rect className="sig-sheen" x={VX} y={VY} width={VW} height={VH} fill={`url(#sig-sheen-${uid})`} />
      </g>
    </svg>
  );
}

/** Small centered signature used as the loading screen for sections/routes. */
export function SignatureLoader({ className = "", label = "Loading" }: { className?: string; label?: string }) {
  return (
    <div role="status" aria-live="polite" className={`flex flex-col items-center gap-5 ${className}`}>
      <SignatureMark uid="loader" variant="loader" className="h-12 w-auto text-bronze md:h-14" />
      <span className="sig-loader-label label text-[9.5px] text-muted">{label}</span>
    </div>
  );
}
