"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";
import { site } from "@/lib/site";

/** Any WhatsApp link outside the piece page, counted as `whatsapp_click` with where it was. */
export function WhatsAppLink({
  href,
  location,
  className,
  children,
}: {
  href: string;
  location: string;
  className?: string;
  children: ReactNode;
}) {
  if (!site.whatsappNumber) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() => track("whatsapp_click", { location })}
      className={className}
    >
      {children}
    </a>
  );
}
