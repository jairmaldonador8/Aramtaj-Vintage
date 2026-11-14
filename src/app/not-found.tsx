import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-site py-32 text-center">
      <p className="eyebrow">Not found</p>
      <h1 className="display-lg mt-4">This piece has moved on.</h1>
      <p className="mt-4 text-muted">It may have found a new home. Browse what’s available now.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/shop" className="btn-primary">Shop the pieces</Link>
        <Link href="/archive" className="btn-outline">The Archive</Link>
      </div>
    </div>
  );
}
