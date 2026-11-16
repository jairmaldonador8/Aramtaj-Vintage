import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { HeroScroll } from "@/components/hero-scroll";
import { LaunchList } from "@/components/launch-list";
import { PieceGrid } from "@/components/piece-card";
import { PieceImage } from "@/components/piece-image";
import { SignatureMark } from "@/components/signature-mark";
import { NumberedList, SectionHeading } from "@/components/section-heading";
import { getCurrentEdit, getFacets, listPieces } from "@/lib/catalog";
import { editorial } from "@/lib/editorial";
import { decadeLabel, localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/locale-server";
import { CATEGORY_ORDER, site, slugify } from "@/lib/site";

const pad = (n: number) => String(n).padStart(2, "0");

/** Art-directed hero: tall still life on phones, wide still life on desktop. */
function HeroPicture() {
  const common = { alt: editorial.heroWide.alt, sizes: "100vw", priority: true };
  const {
    props: { srcSet: wide },
  } = getImageProps({ ...common, ...editorial.heroWide });
  const {
    props: { srcSet: tall, ...rest },
  } = getImageProps({ ...common, ...editorial.heroTall });
  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={wide} />
      <img
        {...rest}
        srcSet={tall}
        alt={editorial.heroWide.alt}
        className="hero-img absolute inset-0 size-full object-cover object-[50%_100%] md:object-[50%_80%]"
      />
    </picture>
  );
}

export default async function HomePage() {
  const { lang, t } = await getI18n();
  const h = t.home;
  const [newIn, edit, facets] = await Promise.all([listPieces({}, lang), getCurrentEdit(lang), getFacets()]);
  const categories = CATEGORY_ORDER.filter((c) => facets.categories.includes(c));
  const coverFor = (filter: (p: (typeof newIn)[number]) => boolean) => newIn.find(filter)?.images[0];
  // Home shows the houses with the most pieces; the full list lives on /designers.
  const piecesBy = (d: string) => newIn.filter((p) => p.designer === d).length;
  const topDesigners = [...facets.designers].sort((a, b) => piecesBy(b) - piecesBy(a) || a.localeCompare(b)).slice(0, 8);

  return (
    <>

      {/* 1 · Hero — Aram's own photoshoot (editorial.heroWide / heroTall) */}
      <section
        id="hero"
        className="relative isolate -mt-[var(--header-h)] flex h-[100svh] max-h-[1000px] min-h-[640px] items-start justify-center overflow-hidden bg-onyx text-marfil">
        <HeroPicture />
        {/* Brand Lab treatment: onyx veil, darkest where the type sits, velvet glow below */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_42%,rgba(16,13,11,0.55)_0%,rgba(16,13,11,0.28)_50%,rgba(16,13,11,0.05)_100%)]"
        />
        <div aria-hidden className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-onyx/70 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-onyx/60 to-transparent" />

        <div className="hero-copy container-site relative flex flex-col items-center pt-[calc(var(--header-h)+7svh)] text-center md:pt-[calc(var(--header-h)+5svh)]">
          <HeroScroll heroId="hero" />
          <SignatureMark uid="hero" variant="hero" title="Aram Taj" className="hero-mark h-[88px] w-auto text-arena md:h-[104px]" />
          <p className="eyebrow hero-in mt-9 text-arena md:mt-8" style={{ ["--i" as string]: 1 }}>
            {h.heroEyebrow}
          </p>
          <h1 className="display-xl hero-in mt-5 max-w-[12ch] md:max-w-none" style={{ ["--i" as string]: 2 }}>
            {h.heroTitle} <span className="accent text-arena">{h.heroAccent}</span>
          </h1>
          <p
            className="lede hero-in mt-6 max-w-[34ch] text-marfil/80 md:max-w-none"
            style={{ ["--i" as string]: 3 }}
          >
            {h.heroLede}
          </p>
          <div
            className="hero-in mt-10 flex w-full max-w-sm md:mt-9 flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row"
            style={{ ["--i" as string]: 4 }}
          >
            <Link href={localePath(lang, "/shop")} className="btn-arena">
              {h.shopPieces}
            </Link>
            <Link href={localePath(lang, "/designers")} className="btn-ghost-light">
              {h.shopByDesigner}
            </Link>
          </div>
        </div>
      </section>

      {/* Facts strip — closes the hero in the same onyx/arena palette */}
      <div className="bg-onyx text-marfil">
        <ul className="container-site grid grid-cols-2 md:grid-cols-4">
          {h.facts.map((f, i) => (
            <li
              key={f}
              data-reveal
              style={{ ["--i" as string]: i }}
              className={`label flex items-center gap-3 border-arena/15 py-5 text-[10px] text-marfil/85 md:justify-center md:py-7 ${
                i % 2 ? "border-l pl-4 md:pl-0" : ""
              } ${i > 0 ? "md:border-l" : ""} ${i > 1 ? "border-t md:border-t-0" : ""}`}
            >
              <span className="ordinal text-[14px] tracking-normal text-arena normal-case">{pad(i + 1)}</span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* 2 · New in */}
      {newIn.length > 0 && (
        <section className="container-site mt-20 md:mt-32">
          <SectionHeading
            eyebrow={h.newInEyebrow}
            title={
              <>
                {h.newIn[0]} <span className="accent">{h.newIn[1]}</span>
              </>
            }
            href={localePath(lang, "/shop")}
            linkLabel={h.viewAll}
          />
          <PieceGrid pieces={newIn.slice(0, 8)} />
        </section>
      )}

      {/* 3 · The current Edit — dark velvet band */}
      {edit && (
        <section className="mt-24 bg-onyx text-cream md:mt-36">
          <div className="grid md:grid-cols-2">
            <div data-reveal="image" className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[640px]">
              <Image
                src={editorial.velvet.src}
                alt={editorial.velvet.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center px-5 py-16 sm:px-8 md:px-14 lg:px-20">
              <p data-reveal className="eyebrow text-arena">
                {h.editEyebrow}
              </p>
              {/* TODO: Edit title/intro from the Shopify collection once connected */}
              <h2 data-reveal className="display-md mt-5">
                {h.editTitle[0]} <span className="accent text-arena">{h.editTitle[1]}</span>
              </h2>
              <p data-reveal className="mt-6 max-w-md leading-relaxed text-cream/70">
                {h.editBody(edit.pieces.length)}
              </p>
              <ol className="mt-10 max-w-md border-b border-cream/15">
                {edit.pieces.slice(0, 3).map((p, i) => (
                  <li key={p.id} data-reveal style={{ ["--i" as string]: i }}>
                    <Link
                      href={localePath(lang, `/pieces/${p.handle}`)}
                      className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-2 border-t border-cream/15 py-5"
                    >
                      <span className="ordinal text-arena">{pad(i + 1)}</span>
                      <span className="piece-name transition-colors duration-500 group-hover:text-arena">
                        {p.title}
                      </span>
                      <span className="label text-[9.5px] text-cream/45">{decadeLabel(p.decade, lang)}</span>
                    </Link>
                  </li>
                ))}
              </ol>
              <div data-reveal className="mt-11">
                <Link href={localePath(lang, "/shop")} className="btn-arena">
                  {h.seeEdit}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4 · Shop by category */}
      {categories.length > 0 && (
        <section className="container-site mt-24 md:mt-36">
          <SectionHeading
            eyebrow={h.browse}
            title={
              <>
                {h.byCategory[0]} <span className="accent">{h.byCategory[1]}</span>
              </>
            }
          />
          <ul className="-mx-5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0 lg:gap-x-6">
            {categories.map((c, i) => (
              <li
                key={c}
                data-reveal
                style={{ ["--i" as string]: i }}
                className="w-[64%] shrink-0 snap-start scroll-ml-5 sm:w-[40%] md:w-auto"
              >
                <Link href={localePath(lang, `/shop/${c}`)} className="group block">
                  <PieceImage
                    image={coverFor((p) => p.category === c)}
                    sizes="(min-width: 768px) 20vw, 64vw"
                    label={t.categories[c]}
                  />
                  <div className="mt-3.5 flex items-baseline gap-3 border-t border-line pt-3.5">
                    <span className="ordinal">{pad(i + 1)}</span>
                    <span className="display-sm text-[24px] transition-colors duration-500 group-hover:text-bronze">
                      {t.categories[c]}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 5 · Shop by designer */}
      {facets.designers.length > 0 && (
        <section className="mt-24 bg-sand py-20 md:mt-36 md:py-32">
          <div className="container-site">
            <SectionHeading
              eyebrow={h.signatureFilter}
              title={
                <>
                  {h.byDesigner[0]} <span className="accent">{h.byDesigner[1]}</span>
                </>
              }
              href={localePath(lang, "/designers")}
              linkLabel={h.viewAll}
            />
            <ul className="border-b border-line">
              {topDesigners.map((d, i) => (
                <li key={d} data-reveal style={{ ["--i" as string]: i }}>
                  <Link
                    href={`${localePath(lang, "/designers")}#${slugify(d)}`}
                    className="group grid grid-cols-[2.75rem_1fr_auto] items-center border-t border-line py-5 md:py-7"
                  >
                    <span className="ordinal">{pad(i + 1)}</span>
                    <span className="display text-[30px] font-light transition-[color,transform] duration-700 ease-[var(--ease-lux)] group-hover:translate-x-2 group-hover:text-bronze md:text-[48px]">
                      {d}
                    </span>
                    <span
                      aria-hidden
                      className="text-lg text-muted transition-transform duration-500 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 6 · Why Aram Taj */}
      <section className="container-site mt-24 md:mt-36">
        <SectionHeading
          eyebrow={h.whyEyebrow}
          title={
            <>
              {h.whyTitle[0]} <span className="accent">{h.whyTitle[1]}</span>
            </>
          }
        />
        {/* TODO: confirm the shipping wording with Aram */}
        <NumberedList items={h.trust} />
      </section>

      {/* 7 · Aram's story + Instagram */}
      <section className="container-site mt-24 grid gap-10 md:mt-36 md:grid-cols-2 md:items-center md:gap-20">
        <div data-reveal="image" className="relative aspect-[4/5] overflow-hidden bg-sand">
          <Image
            src={editorial.aram.src}
            alt={editorial.aram.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p data-reveal className="eyebrow">
            {h.meetEyebrow}
          </p>
          <h2 data-reveal className="display-md mt-4">
            {h.meetTitle[0]} <span className="accent">{h.meetTitle[1]}</span>
          </h2>
          <p data-reveal className="lede mt-6 max-w-md text-muted">
            {/* Aram's own words (Instagram "About" highlight). TODO: Aram approves the final copy. */}
            {h.meetBody}
          </p>
          <div data-reveal className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href={localePath(lang, "/about")} className="btn-primary">
              {h.readStory}
            </Link>
            <a href={site.instagram} target="_blank" rel="noreferrer" className="btn-outline">
              {h.followInstagram}
            </a>
          </div>
        </div>
      </section>

      {/* 8 · Join the US launch list */}
      <div className="mt-24 -mb-28 md:mt-36">
        <LaunchList source="home" />
      </div>
    </>
  );
}
