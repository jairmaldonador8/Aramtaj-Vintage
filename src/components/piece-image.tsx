import Image from "next/image";
import type { PieceImage as PieceImageType } from "@/lib/catalog/types";

/**
 * Product photo (with optional second "worn" photo that crossfades in on
 * hover-capable devices), or a neutral placeholder until photos arrive.
 */
export function PieceImage({
  image,
  hoverImage,
  sizes,
  priority,
  label,
}: {
  image?: PieceImageType;
  hoverImage?: PieceImageType;
  sizes: string;
  priority?: boolean;
  label?: string;
}) {
  if (!image) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center bg-sand">
        <span className="accent px-4 text-center text-lg text-muted">{label ?? "Photo coming soon"}</span>
      </div>
    );
  }
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-sand">
      <Image
        src={image.url}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-lux)] group-hover:scale-[1.04]"
      />
      {hoverImage && (
        <Image
          src={hoverImage.url}
          alt=""
          aria-hidden
          fill
          sizes={sizes}
          className="hidden object-cover opacity-0 transition-opacity duration-700 ease-[var(--ease-lux)] group-hover:opacity-100 [@media(hover:hover)]:block"
        />
      )}
    </div>
  );
}
