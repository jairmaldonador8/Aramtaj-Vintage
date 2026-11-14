"use client";

import { WhatsAppIcon } from "@/components/whatsapp-float";
import { track } from "@/lib/analytics";
import type { SaleStatus } from "@/lib/catalog/types";
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
}: {
  handle: string;
  title: string;
  status: SaleStatus;
}) {
  if (status === "sold") {
    return (
      <div className="space-y-3">
        <p className="btn w-full cursor-default border border-line text-muted">Sold — in the Archive</p>
        <a
          href={whatsappLink(`Hi Aram! I saw "${title}" in the Archive. Do you have something similar?`)}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("whatsapp_click", { location: "piece_sold", piece: handle })}
          className="link-underline block text-center text-sm"
        >
          Ask for something similar
        </a>
      </div>
    );
  }

  if (status === "reserved") {
    return (
      <div className="space-y-2">
        <p className="btn w-full cursor-default bg-sand text-muted">Reserved</p>
        <p className="text-center text-sm text-muted">
          Someone is finalizing this piece. If it becomes available again, it will show here.
        </p>
      </div>
    );
  }

  const url = `${site.url}/pieces/${handle}`;
  return (
    <a
      href={whatsappLink(`Hi Aram! I'm interested in "${title}".\n${url}`)}
      target="_blank"
      rel="noreferrer"
      onClick={() => track("whatsapp_click", { location: "piece", piece: handle })}
      className="btn-primary w-full"
    >
      <WhatsAppIcon className="size-4" />
      Ask about this piece
    </a>
  );
}
