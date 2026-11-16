import type { Metadata } from "next";
import Image from "next/image";
import { LaunchList } from "@/components/launch-list";
import { editorial } from "@/lib/editorial";
import type { Lang } from "@/lib/i18n";
import { alternatesFor, getI18n } from "@/lib/locale-server";

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t } = await getI18n();
  return { title: t.meta.about.title, description: t.meta.about.description, alternates: alternatesFor(lang, "/about") };
}

/*
 * Aram's own words, from the "About" highlight on her Instagram
 * (@vintagebijouxbyaramtaj, nov 2026). She posted every slide in English and
 * Spanish, so each language uses her own version, with only light edits.
 * The English "Made to last" closing line is translated from her Spanish slide
 * (that slide had no English text). TODO: Aram approves the final copy.
 */
const COPY: Record<Lang, { sections: { title: string; paragraphs: string[] }[]; quote: string }> = {
  en: {
    sections: [
      {
        title: "Her story",
        paragraphs: [
          "I’m a Persian-British interior designer living in Mexico, with a deep passion for vintage jewelry. Over the years, I found myself unable to resist adding beautiful pieces to my collection. One by one, they kept growing.",
          "Since I was a child, I’d open my grandma’s jewelry box and try everything on in front of the mirror. I’ve been obsessed with vintage pearls and gold ever since — they’ve always felt like magic to me.",
        ],
      },
      {
        title: "How she curates",
        paragraphs: [
          "Every piece I offer is hand-selected from trusted dealers across Europe — especially the UK, Italy, France and the USA. Some are incredibly rare. Many are signed by renowned vintage designers. Some were worn by public figures decades ago. All of them carry a story.",
          "I’ve collected these pieces with different styles in mind. Whether you’re bold, minimal, romantic or classic, there’s something here that feels like you.",
        ],
      },
      {
        title: "Made to last",
        paragraphs: [
          "When you hold them, you’ll feel it. The weight. The craftsmanship. The way they’ve lasted 50+ years and still shine.",
          "I’ve always preferred pieces like these: timeless, full of history, made to last. If they’ve made it this far, they can live many more years with you.",
        ],
      },
    ],
    quote:
      "Jewelry isn’t just something you wear — it becomes part of you. Honestly, I’d keep every piece. But they deserve new homes, with people who understand them, wear them and keep their story alive.",
  },
  es: {
    sections: [
      {
        title: "Su historia",
        paragraphs: [
          "Soy arquitecta y diseñadora de interiores persa-británica y vivo en México, con una profunda pasión por la joyería vintage. Con el paso de los años, no pude resistirme a añadir piezas hermosas a mi colección. Una a una, fueron creciendo.",
          "Desde niña, abría el joyero de mi abuela y me probaba todo frente al espejo. Las perlas y el oro vintage siempre me parecieron mágicos.",
        ],
      },
      {
        title: "Cómo elige cada pieza",
        paragraphs: [
          "Cada pieza que ofrezco ha sido seleccionada a mano de proveedores de confianza en Europa, especialmente en el Reino Unido, Italia y Francia. Algunas son increíblemente raras. Muchas están firmadas por diseñadores vintage reconocidos. Algunas fueron usadas por figuras públicas. Todas tienen una historia que contar.",
          "He reunido estas piezas pensando en distintos estilos. Ya seas atrevida, minimalista, romántica o clásica, hay algo aquí que se siente como tú.",
        ],
      },
      {
        title: "Hechas para durar",
        paragraphs: [
          "Cuando las tengas en tus manos, lo sentirás: el peso, la artesanía, la forma en que han resistido más de 50 años y aún brillan.",
          "Siempre he preferido comprar piezas así: atemporales, llenas de historia, hechas para durar. Si han llegado hasta aquí, también podrán vivir muchos años más contigo.",
        ],
      },
    ],
    quote:
      "Soy una fiel creyente de que la joyería no es solo algo que usas: es algo que se vuelve parte de ti. Honestamente, me quedaría con cada pieza. Pero merecen nuevos hogares, con personas que las entiendan, las usen y mantengan viva su historia.",
  },
};

export default async function AboutPage() {
  const { lang, t } = await getI18n();
  const copy = COPY[lang];
  return (
    <>
      <div className="container-site pt-12 md:pt-16">
        <p className="eyebrow">{t.about.eyebrow}</p>
        <h1 className="display-lg mt-3">
          {t.about.title[0]} <span className="accent">{t.about.title[1]}</span>
        </h1>
        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden bg-sand md:sticky md:top-24 md:self-start">
            <Image
              src={editorial.aram.src}
              alt={editorial.aram.alt}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            {copy.sections.map((s, i) => (
              <section
                key={s.title}
                className={`grid grid-cols-[2.75rem_minmax(0,1fr)] border-t border-line py-8 ${i === 0 ? "border-t-0 pt-0" : ""}`}
              >
                <span className="ordinal pt-2">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="display-sm">{s.title}</h2>
                  {s.paragraphs.map((p) => (
                    <p key={p.slice(0, 24)} className="mt-4 leading-relaxed text-ink/80">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
            <figure className="border-t border-line pt-10">
              <blockquote className="accent text-[26px] leading-snug md:text-[30px]">“{copy.quote}”</blockquote>
              <figcaption className="label mt-5 text-[10px] text-bronze">{t.about.quoteBy}</figcaption>
            </figure>
          </div>
        </div>
      </div>
      <div className="mt-24 -mb-28">
        <LaunchList source="about" />
      </div>
    </>
  );
}
