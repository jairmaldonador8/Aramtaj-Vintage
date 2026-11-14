import type { Metadata } from "next";
import Image from "next/image";
import { LaunchList } from "@/components/launch-list";
import { editorial } from "@/lib/editorial";

export const metadata: Metadata = {
  title: "About Aram",
  description: "Meet Aram Taj, who handpicks signed vintage jewelry across Europe. How she curates, authenticates and cares for every piece.",
  alternates: { canonical: "/about" },
};

const SECTIONS = ["Her story", "How she curates", "Authenticity & signatures"];

export default function AboutPage() {
  return (
    <>
      <div className="container-site pt-12 md:pt-16">
        <p className="eyebrow">About</p>
        <h1 className="display-lg mt-3">Meet Aram</h1>
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden bg-sand md:sticky md:top-24 md:self-start">
            {/* TODO: replace with a photo of Aram */}
            <Image src={editorial.atelier.src} alt={editorial.atelier.alt} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="space-y-10">
            {SECTIONS.map((title) => (
              <section key={title}>
                <h2 className="display-sm">{title}</h2>
                <p className="mt-3 leading-relaxed text-muted">TODO: Aram’s own words.</p>
              </section>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-24 -mb-28">
        <LaunchList />
      </div>
    </>
  );
}
