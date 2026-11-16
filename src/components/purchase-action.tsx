"use client";

import { useEffect, useState } from "react";
import { Price } from "@/components/price";
import { useI18n } from "@/components/providers";
import { WhatsAppIcon } from "@/components/whatsapp-float";
import { track } from "@/lib/analytics";
import type { Money, SaleStatus } from "@/lib/catalog/types";
import { localePath } from "@/lib/i18n";
import { site, whatsappLink } from "@/lib/site";

/**
 * The ONLY place that decides how a piece is bought.
 * Step 1: WhatsApp inquiry. Step 2: swap the body for "Add to cart"
 * without touching the product page.
 */
export function PurchaseAction({
  handle,
  title,
  status,
  id,
}: {
  handle: string;
  title: string;
  status: SaleStatus;
  id?: string;
}) {
  const { lang, t } = useI18n();

  if (status === "sold") {
    return (
      <div id={id} className="space-y-3">
        <p className="btn w-full cursor-default border border-line text-muted">{t.piece.soldArchive}</p>
        <a
          href={whatsappLink(t.whatsapp.similar(title))}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("whatsapp_click", { location: "piece_sold", piece: handle })}
          className="link-underline block text-center text-sm"
        >
          {t.piece.askSimilar}
        </a>
      </div>
    );
  }

  if (status === "reserved") {
    return (
      <div id={id} className="space-y-2">
        <p className="btn w-full cursor-default bg-sand text-muted">{t.piece.reserved}</p>
        <p className="text-center text-sm text-muted">{t.piece.reservedNote}</p>
      </div>
    );
  }

  const url = `${site.url}${localePath(lang, `/pieces/${handle}`)}`;
  return (
    <a
      id={id}
      href={whatsappLink(t.whatsapp.piece(title, url))}
      target="_blank"
      rel="noreferrer"
      onClick={() => track("whatsapp_click", { location: "piece", piece: handle })}
      className="btn-primary w-full"
    >
      <WhatsAppIcon className="size-4" />
      {t.piece.ask}
    </a>
  );
}

/**
 * Phones: the inquiry stays one thumb away, but only once the main button has
 * scrolled out of view (so it never doubles up or covers the title).
 */
export function StickyInquiry({
  targetId,
  handle,
  title,
  label,
  price,
}: {
  targetId: string;
  handle: string;
  title: string;
  label: string;
  price: Money | null;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [targetId]);

  return (
    <div
      aria-hidden={!show}
      inert={!show}
      className={`sticky-cta fixed inset-x-0 bottom-0 z-30 border-t border-line bg-cream/95 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-500 ease-[var(--ease-lux)] md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="piece-name truncate text-[20px]">{label}</span>
        <Price price={price} className="shrink-0 text-[14px]" />
      </div>
      <PurchaseAction handle={handle} title={title} status="available" />
    </div>
  );
}
