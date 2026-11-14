import type { Metadata } from "next";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Help — Shipping, Care & Returns",
  description: "How to buy, shipping, jewelry care and returns for Aram Taj Vintage.",
  alternates: { canonical: "/help" },
};

const TOPICS = [
  {
    id: "how-to-buy",
    title: "How to buy",
    body: "Find a piece you love and tap “Ask about this piece”. It opens WhatsApp with the piece already in the message, and Aram will reply personally to confirm availability, payment and shipping.",
  },
  { id: "shipping", title: "Shipping", body: "TODO: shipping policy from Aram (destinations, carriers, timing, cost)." },
  { id: "care", title: "Caring for vintage jewelry", body: "TODO: care guide from Aram." },
  { id: "returns", title: "Returns", body: "TODO: returns policy from Aram." },
  { id: "authenticity", title: "Authenticity", body: "TODO: how Aram verifies signatures and condition." },
];

export default function HelpPage() {
  return (
    <div className="container-site pt-12 md:pt-16">
      <p className="eyebrow">Help</p>
      <h1 className="display-lg mt-3">How can we help?</h1>
      <div className="mt-12 grid gap-12 md:grid-cols-[14rem_1fr]">
        <nav aria-label="Help topics" className="md:sticky md:top-24 md:self-start">
          <ul className="space-y-3 text-sm">
            {TOPICS.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} className="text-muted hover:text-ink">
                  {t.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="divide-y divide-line border-y border-line">
          {TOPICS.map((t) => (
            <section key={t.id} id={t.id} className="scroll-mt-24 py-8">
              <h2 className="display-sm">{t.title}</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted">{t.body}</p>
            </section>
          ))}
          <section className="py-8">
            <h2 className="display-sm">Still have a question?</h2>
            <a
              href={whatsappLink("Hi Aram! I have a question.")}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-5"
              hidden={!site.whatsappNumber}
            >
              Message Aram on WhatsApp
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
