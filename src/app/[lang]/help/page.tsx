import type { Metadata } from "next";
import { alternatesFor, getI18n } from "@/lib/locale-server";
import { site, whatsappLink } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t } = await getI18n();
  return { title: t.meta.help.title, description: t.meta.help.description, alternates: alternatesFor(lang, "/help") };
}

/*
 * TODO: Aram's policies — shipping (destinations, carriers, timing, cost), care guide, returns,
 * and how she verifies signatures and condition. Give each one its own section with
 * { id, title, body } as they arrive; until then a single block sends visitors to WhatsApp,
 * so no empty sections are published.
 */
export default async function HelpPage() {
  const { t } = await getI18n();
  const h = t.help;
  const sections = [
    { id: "how-to-buy", title: h.howToBuy, body: h.howToBuyBody, cta: false },
    { id: "shipping", title: h.pendingTitle, body: h.pending, cta: true },
  ];
  return (
    <div className="container-site pt-12 md:pt-16">
      <p className="eyebrow">{h.eyebrow}</p>
      <h1 className="display-lg mt-3">{h.title}</h1>
      <div className="mt-10 max-w-3xl border-t border-line md:mt-14">
        {sections.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className="grid scroll-mt-24 grid-cols-[2.75rem_minmax(0,1fr)] border-b border-line py-8 md:py-10"
          >
            <span className="ordinal pt-2">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2 className="display-sm">{s.title}</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-ink/80">{s.body}</p>
              {s.cta && site.whatsappNumber && (
                <a href={whatsappLink(t.whatsapp.question)} target="_blank" rel="noreferrer" className="btn-primary mt-6 w-full sm:w-auto">
                  {h.message}
                </a>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
