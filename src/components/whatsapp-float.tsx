"use client";

import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";
import { site, whatsappLink } from "@/lib/site";

export function WhatsAppFloat() {
  // Piece pages have their own sticky inquiry bar on phones.
  const onPiece = usePathname().startsWith("/pieces/");
  return (
    <a
      href={whatsappLink("Hi Aram! I have a question about your vintage pieces.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Aram on WhatsApp"
      onClick={() => track("whatsapp_click", { location: "floating_button" })}
      className={`fixed right-4 bottom-4 z-40 size-14 ${onPiece ? "hidden md:flex" : "flex"} items-center justify-center rounded-full bg-ink text-cream shadow-lg shadow-ink/20 transition-transform hover:scale-105 md:right-6 md:bottom-6`}
      hidden={!site.whatsappNumber}
    >
      <WhatsAppIcon className="size-6" />
    </a>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.23 9.43-9.44 9.43m8.03-17.46A11.27 11.27 0 0 0 12.05.7C5.8.7.7 5.8.7 12.06c0 2 .52 3.95 1.52 5.67L.6 23.6l6.02-1.58a11.33 11.33 0 0 0 5.42 1.38h.01c6.26 0 11.35-5.1 11.36-11.35 0-3.03-1.18-5.88-3.33-8.02" />
    </svg>
  );
}
