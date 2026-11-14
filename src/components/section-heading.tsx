import Link from "next/link";

/** Slide pattern: bronze eyebrow, large title, optional link on the right. */
export function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel = "View all",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div data-reveal className="mb-10 flex items-end justify-between gap-6 md:mb-16">
      <div>
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h2 className="display-md">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="link-line mb-1 shrink-0">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

/**
 * Numbered two-column list with hairlines — the order of the approved
 * proposal slide (01 Hero / 02 The current Edit …).
 */
export function NumberedList({ items }: { items: { title: string; body: string }[] }) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <ol
      className="grid gap-x-16 md:grid-flow-col md:grid-cols-2 md:[grid-template-rows:repeat(var(--rows),auto)]"
      style={{ ["--rows" as string]: Math.ceil(items.length / 2) }}
    >
      {items.map((item, i) => (
        <li
          key={item.title}
          data-reveal
          style={{ ["--i" as string]: i }}
          className="grid grid-cols-[2.75rem_1fr] border-t border-line py-7"
        >
          <span className="ordinal pt-1">{pad(i + 1)}</span>
          <div>
            <h3 className="display-sm text-[26px] md:text-[28px]">{item.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
