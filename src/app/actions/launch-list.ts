"use server";

import { appendFile } from "node:fs/promises";
import path from "node:path";

export type LaunchListState =
  | { status: "idle" }
  | { status: "ok" }
  | { status: "error"; reason: "invalid" | "not-configured" | "failed" };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * "Join the US launch list" (step 4).
 *
 * Where emails go is pending Jair's decision (Shopify customers, Klaviyo…), so the
 * destination is a plain webhook: set LAUNCH_LIST_WEBHOOK_URL (server only) to any
 * endpoint that accepts JSON — Zapier/Make, Klaviyo, Google Apps Script, Shopify Flow.
 * In local development without a webhook, sign-ups are appended to
 * .launch-list.local.jsonl (git-ignored) so the form can be tested end to end.
 * In production without a webhook the form says so and points to WhatsApp.
 */
export async function joinLaunchList(_prev: LaunchListState, formData: FormData): Promise<LaunchListState> {
  // Honeypot: bots fill every field; people never see this one.
  if (String(formData.get("company") ?? "").trim()) return { status: "ok" };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (email.length > 254 || !EMAIL.test(email)) return { status: "error", reason: "invalid" };

  const entry = { email, source: String(formData.get("source") ?? "site"), createdAt: new Date().toISOString() };
  const webhook = process.env.LAUNCH_LIST_WEBHOOK_URL;

  try {
    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
        cache: "no-store",
      });
      if (!res.ok) return { status: "error", reason: "failed" };
      return { status: "ok" };
    }
    if (process.env.NODE_ENV !== "production") {
      await appendFile(path.join(process.cwd(), ".launch-list.local.jsonl"), JSON.stringify(entry) + "\n");
      return { status: "ok" };
    }
    return { status: "error", reason: "not-configured" };
  } catch {
    return { status: "error", reason: "failed" };
  }
}
