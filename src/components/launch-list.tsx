import { WhatsAppIcon } from "@/components/whatsapp-float";
import { whatsappLink } from "@/lib/site";

/**
 * "Join the US launch list". TODO (step 4): store emails in a real list
 * (Shopify customers / Klaviyo — pending decision). For now the CTA goes
 * through WhatsApp so no sign-up is lost.
 */
export function LaunchList() {
  return (
    <section id="launch-list" className="scroll-mt-24 bg-onyx text-cream">
      <div className="container-site grid gap-10 py-20 md:grid-cols-2 md:items-center">
        <div>
          <p className="eyebrow text-arena">Moving to the USA</p>
          <h2 className="display-md mt-4">Join the US launch list</h2>
          <p className="mt-5 max-w-md text-cream/70">
            Be the first to know when the shop opens in the United States, and get early access to every new
            Edit.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <a
            href={whatsappLink("Hi Aram! Please add me to the US launch list.")}
            target="_blank"
            rel="noreferrer"
            className="btn-arena w-full md:w-auto"
          >
            <WhatsAppIcon className="size-4" />
            Join via WhatsApp
          </a>
          <p className="text-xs text-cream/50">Email sign-up coming soon.</p>
        </div>
      </div>
    </section>
  );
}
