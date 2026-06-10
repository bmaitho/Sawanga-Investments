import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { SOLUTIONS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Project-focused finishing solutions for developers, contractors, institutions and homeowners.",
};

const SOLUTION_IMAGES: Record<string, string> = {
  developers:   "/images/apartments-golden-hour.jpg",
  contractors:  "/images/kitchen-dark-luxury.jpg",
  institutions: "/images/corridor-luxury-water.jpg",
  homeowners:   "/images/kitchen-warm-modern.jpg",
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Built around"
        highlight="your project."
        subtitle="Whoever you are and whatever you are building, SAWANGA matches the right products, pricing and supply to your needs."
        bgImage="/images/apartments-golden-hour.jpg"
      />

      <section className="pb-24">
        <div className="container-luxe grid gap-8 lg:grid-cols-2">
          {SOLUTIONS.map((s, i) => {
            const imgSrc = SOLUTION_IMAGES[s.slug];
            return (
              <Reveal key={s.slug} delay={(i % 2) * 90}>
                <div id={s.slug} className="card-luxe flex h-full scroll-mt-28 flex-col overflow-hidden hover:border-gold/30">
                  {imgSrc && (
                    <div className="relative w-full overflow-hidden" style={{ paddingBottom: "52%" }}>
                      <Image
                        src={imgSrc}
                        alt={s.title}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      {/* strong gradient — text must be legible on mobile */}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/95 via-navy-900/50 to-navy-900/10" />
                      <div className="absolute bottom-4 left-5 right-5 flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/20 text-gold backdrop-blur-sm">
                          <Icon name={s.icon} className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="font-display text-xl font-semibold leading-tight text-cream drop-shadow-lg">{s.title}</h2>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gold drop-shadow-md">{s.audience}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-7 md:p-8">
                    <p className="leading-relaxed text-cream/75">{s.description}</p>
                    <div className="mt-5 space-y-3">
                      {s.points.map((pt) => (
                        <div key={pt} className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                            <Check className="h-3 w-3" />
                          </span>
                          <span className="text-sm text-cream/80">{pt}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto pt-7">
                      <Link href={`/quote?type=${s.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:underline">
                        Get started <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="relative border-t border-gold/15 py-20">
        <Image src="/images/bathroom-stone-basin.jpg" alt="" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-700/92 to-navy-900/92" />
        <div className="container-luxe relative">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <span className="eyebrow">For Developers</span>
              <h2 className="mt-4 font-display text-3xl font-semibold text-cream sm:text-4xl">
                Exclusive <span className="text-white font-bold">flexible credit</span> terms
              </h2>
              <p className="mt-5 text-cream/75">
                We understand developer cash flow. Qualifying developers access flexible credit,
                volume pricing and scheduled deliveries.
              </p>
              <Link href="/contact" className="btn-gold mt-8">
                Apply for developer credit <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
