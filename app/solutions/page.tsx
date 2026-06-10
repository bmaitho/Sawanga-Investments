import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { SOLUTIONS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Solutions â€” Developers, Contractors, Institutions & Homeowners",
  description:
    "Project-focused finishing solutions tailored for developers (with flexible credit), contractors, institutions and homeowners across Kenya.",
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Built around"
        highlight="your project."
        subtitle="Whoever you are and whatever you're building, SAWANGA matches the right products, pricing and supply to your needs."
        bgImage="/images/apartments-golden-hour.jpg"
      />

      <section className="pb-24">
        <div className="container-luxe grid gap-8 lg:grid-cols-2">
          {SOLUTIONS.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 2) * 90}>
              <div
                id={s.slug}
                className="card-luxe flex h-full scroll-mt-28 flex-col overflow-hidden hover:border-gold/30"
              >
                {/* Image banner per solution */}
                {[
                  { slug: "developers", img: "/images/apartments-golden-hour.jpg" },
                  { slug: "contractors", img: "/images/kitchen-dark-luxury.jpg" },
                  { slug: "institutions", img: "/images/corridor-luxury-water.jpg" },
                  { slug: "homeowners", img: "/images/kitchen-warm-modern.jpg" },
                ].find(x => x.slug === s.slug) && (
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={[
                        { slug: "developers", img: "/images/apartments-golden-hour.jpg" },
                        { slug: "contractors", img: "/images/kitchen-dark-luxury.jpg" },
                        { slug: "institutions", img: "/images/corridor-luxury-water.jpg" },
                        { slug: "homeowners", img: "/images/kitchen-warm-modern.jpg" },
                      ].find(x => x.slug === s.slug)!.img}
                      alt={s.title}
                      fill
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
                    <div className="absolute bottom-4 left-6 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/20 backdrop-blur-sm text-gold">
                        <Icon name={s.icon} className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-semibold text-cream">{s.title}</h2>
                        <p className="text-xs uppercase tracking-wide text-gold/70">{s.audience}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex flex-1 flex-col p-8 md:p-10">
                  <p className="leading-relaxed text-cream/70">{s.description}</p>
                  <div className="mt-6 space-y-3">
                    {s.points.map((pt) => (
                      <div key={pt} className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-gold">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-sm text-cream/80">{pt}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto pt-8">
                    <Link
                      href={`/quote?type=${s.slug}`}
                      className="inline-flex items-center gap-1 font-semibold text-gold hover:underline"
                    >
                      Get started <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Developer credit highlight */}
      <section className="relative border-t border-gold/15 py-20">
        <Image
          src="/images/bathroom-stone-basin.jpg"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-700/90 to-navy-900/90" />
        <div className="container-luxe relative">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <span className="eyebrow">For Developers</span>
              <h2 className="mt-4 font-display text-4xl font-semibold text-cream">
                Exclusive <span className="gold-text">flexible credit</span> terms
              </h2>
              <p className="mt-5 text-cream/70">
                We understand developer cash flow. Qualifying developers access flexible credit,
                volume pricing and scheduled deliveries â€” so your finishing supply never holds up
                your build. Speak to us about setting up a credit account.
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
