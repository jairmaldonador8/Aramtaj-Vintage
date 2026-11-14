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
import { CATEGORY_LABELS, CATEGORY_ORDER, site, slugify } from "@/lib/site";

const TRUST = [
  { title: "Signed & authenticated", body: "Nearly every piece carries its maker’s signature, checked by hand." },
  { title: "One of one", body: "Each piece is unique. Once it’s gone, it moves to the Archive." },
  { title: "Condition, documented", body: "Measurements, materials and condition listed before you ask." },
  { title: "Shipped with care", body: "Packed by Aram and sent directly to you." }, // TODO: confirm shipping wording with Aram
];

const FACTS = ["One of one", "Signed pieces", "1960s – 1990s", "Curated in Europe"];
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
  const [newIn, edit, facets] = await Promise.all([listPieces(), getCurrentEdit(), getFacets()]);
  const categories = CATEGORY_ORDER.filter((c) => facets.categories.includes(c));
  const coverFor = (filter: (p: (typeof newIn)[number]) => boolean) => newIn.find(filter)?.images[0];

  return (
    <>

      {/* 1 · Hero — TODO: swap the placeholder still life for Aram's own photo/video */}
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
            Signed vintage · 1960s–1990s
          </p>
          <h1 className="display-xl hero-in mt-5 max-w-[12ch] md:max-w-none" style={{ ["--i" as string]: 2 }}>
            Handpicked across <span className="accent text-arena">Europe.</span>
          </h1>
          <p
            className="lede hero-in mt-6 max-w-[34ch] text-marfil/80 md:max-w-none"
            style={{ ["--i" as string]: 3 }}
          >
            Designer costume jewelry, one of one. Find your piece and ask Aram directly on WhatsApp.
          </p>
          <div
            className="hero-in mt-10 flex w-full max-w-sm md:mt-9 flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row"
            style={{ ["--i" as string]: 4 }}
          >
            <Link href="/shop" className="btn-arena">
              Shop the pieces
            </Link>
            <Link href="/designers" className="btn-ghost-light">
              Shop by designer
            </Link>
          </div>
        </div>
      </section>

      {/* Facts strip — closes the hero in the same onyx/arena palette */}
      <div className="bg-onyx text-marfil">
        <ul className="container-site grid grid-cols-2 md:grid-cols-4">
          {FACTS.map((f, i) => (
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
            eyebrow="Just arrived"
            title={
              <>
                New <span className="accent">in</span>
              </>
            }
            href="/shop"
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
                The current Edit
              </p>
              {/* TODO: Edit title/intro from the Shopify collection once connected */}
              <h2 data-reveal className="display-md mt-5">
                This season’s <span className="accent text-arena">drop</span>
              </h2>
              <p data-reveal className="mt-6 max-w-md leading-relaxed text-cream/70">
                {edit.pieces.length} pieces, each one of one. Drops, not an endless catalog — when a piece is gone,
                it’s gone.
              </p>
              <ol className="mt-10 max-w-md border-b border-cream/15">
                {edit.pieces.slice(0, 3).map((p, i) => (
                  <li key={p.id} data-reveal style={{ ["--i" as string]: i }}>
                    <Link
                      href={`/pieces/${p.handle}`}
                      className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-2 border-t border-cream/15 py-5"
                    >
                      <span className="ordinal text-arena">{pad(i + 1)}</span>
                      <span className="piece-name transition-colors duration-500 group-hover:text-arena">
                        {p.title}
                      </span>
                      <span className="label text-[9.5px] text-cream/45">{p.decade}</span>
                    </Link>
                  </li>
                ))}
              </ol>
              <div data-reveal className="mt-11">
                <Link href="/shop" className="btn-arena">
                  See the Edit
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
            eyebrow="Browse"
            title={
              <>
                Shop by <span className="accent">category</span>
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
                <Link href={`/shop/${c}`} className="group block">
                  <PieceImage
                    image={coverFor((p) => p.category === c)}
                    sizes="(min-width: 768px) 20vw, 64vw"
                    label={CATEGORY_LABELS[c]}
                  />
                  <div className="mt-3.5 flex items-baseline gap-3 border-t border-line pt-3.5">
                    <span className="ordinal">{pad(i + 1)}</span>
                    <span className="display-sm text-[24px] transition-colors duration-500 group-hover:text-bronze">
                      {CATEGORY_LABELS[c]}
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
              eyebrow="The signature is the filter"
              title={
                <>
                  Shop by <span className="accent">designer</span>
                </>
              }
              href="/designers"
            />
            <ul className="border-b border-line">
              {facets.designers.map((d, i) => (
                <li key={d} data-reveal style={{ ["--i" as string]: i }}>
                  <Link
                    href={`/designers#${slugify(d)}`}
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
          eyebrow="Why Aram Taj"
          title={
            <>
              Collected, <span className="accent">not mass-made</span>
            </>
          }
        />
        <NumberedList items={TRUST} />
      </section>

      {/* 7 · Aram's story + Instagram — TODO: Aram's own words and photos */}
      <section className="container-site mt-24 grid gap-10 md:mt-36 md:grid-cols-2 md:items-center md:gap-20">
        <div data-reveal="image" className="relative aspect-[4/5] overflow-hidden bg-sand">
          <Image
            src={editorial.atelier.src}
            alt={editorial.atelier.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p data-reveal className="eyebrow">
            Meet Aram
          </p>
          <h2 data-reveal className="display-md mt-4">
            Every piece, <span className="accent">chosen by hand</span>
          </h2>
          <p data-reveal className="lede mt-6 max-w-md text-muted">
            {/* TODO: Aram's story in her own words — how she finds each piece, what she looks for, why signed vintage. */}
            Aram travels Europe for signed costume jewelry from the 1960s to the 1990s — checking every signature, clasp
            and stone before a piece joins the Edit.
          </p>
          <div data-reveal className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/about" className="btn-primary">
              Read her story
            </Link>
            <a href={site.instagram} target="_blank" rel="noreferrer" className="btn-outline">
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* 8 · Join the US launch list */}
      <div className="mt-24 -mb-28 md:mt-36">
        <LaunchList />
      </div>
    </>
  );
}
