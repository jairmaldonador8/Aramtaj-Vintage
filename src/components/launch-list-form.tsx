"use client";

import { useActionState, useEffect } from "react";
import { joinLaunchList, type LaunchListState } from "@/app/actions/launch-list";
import { useI18n } from "@/components/providers";
import { WhatsAppIcon } from "@/components/whatsapp-float";
import { WhatsAppLink } from "@/components/whatsapp-link";
import { track } from "@/lib/analytics";

export function LaunchListForm({ whatsappHref, source }: { whatsappHref: string; source: string }) {
  const { t } = useI18n();
  const messages = { invalid: t.launch.invalid, "not-configured": t.launch.notConfigured, failed: t.launch.failed };
  const [state, action, pending] = useActionState<LaunchListState, FormData>(joinLaunchList, { status: "idle" });

  useEffect(() => {
    if (state.status === "ok") track("launch_list_signup", { source });
  }, [state.status, source]);

  if (state.status === "ok") {
    return (
      <p role="status" className="accent text-2xl text-arena md:text-right">
        {t.launch.ok}
      </p>
    );
  }

  return (
    <div className="w-full md:max-w-md">
      <form action={action} className="flex flex-col gap-3 sm:flex-row" noValidate>
        <input type="hidden" name="source" value={source} />
        {/* Honeypot (hidden from people and screen readers) */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        <label className="sr-only" htmlFor={`launch-email-${source}`}>
          {t.launch.email}
        </label>
        <input
          id={`launch-email-${source}`}
          type="email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder={t.launch.placeholder}
          aria-invalid={state.status === "error" && state.reason === "invalid"}
          aria-describedby={`launch-msg-${source}`}
          className="min-h-12 flex-1 border-b border-cream/40 bg-transparent px-1 text-[15px] text-cream outline-none placeholder:text-cream/45 focus:border-arena"
        />
        <button type="submit" disabled={pending} className="btn-arena shrink-0 disabled:opacity-60">
          {pending ? t.launch.joining : t.launch.join}
        </button>
      </form>
      <p id={`launch-msg-${source}`} aria-live="polite" className="mt-3 min-h-5 text-xs text-arena">
        {state.status === "error" ? messages[state.reason] : ""}
      </p>
      <WhatsAppLink
        href={whatsappHref}
        location={`launch_list_${source}`}
        className="mt-2 inline-flex min-h-10 items-center gap-2 text-xs tracking-[0.14em] text-cream/70 uppercase hover:text-arena"
      >
        <WhatsAppIcon className="size-3.5" />
        {t.launch.orWhatsApp}
      </WhatsAppLink>
    </div>
  );
}
