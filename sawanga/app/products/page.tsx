import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { PRODUCTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Products — Paints, Tiles, Gypsum, Granite & Sanitaryware",
  description:
    "Explore SAWANGA's complete finishing range: premium paints & coatings, wall master & putty, tile adhesives, gypsum & decorative finishes, granite & stone, and sanitaryware & fittings.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Core Finishing Products"
        title="A complete range to"
        highlight="finish right."
        subtitle="Sourced from trusted brands and stocked for reliable, on-time supply across Kenya — from a single room to an entire development."
      />

      <section className="pb-24">
        <div className="container-luxe space-y-8">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 80}>
              <div
                id={p.slug}
                className="card-luxe scroll-mt-28 overflow-hidden md:flex"
              >
                <div className="flex items-center justify-center bg-gradient-to-br from-navy-700 to-navy-900 p-10 md:w-2/5">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold">
                      <Icon name={p.icon} className="h-12 w-12" />
                    </div>
                    <h2 className="text-center font-display text-2xl font-semibold text-cream">
                      {p.name}
                    </h2>
                  </div>
                </div>
                <div className="p-8 md:w-3/5 md:p-10">
                  <p className="text-lg leading-relaxed text-cream/75">{p.detail}</p>
                  <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {p.features.map((f) => (
                      <div key={f} className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-gold">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-sm text-cream/80">{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={`/quote?product=${encodeURIComponent(p.name)}`}
                    className="btn-gold group mt-8"
                  >
                    Request a Quote
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-gold/15 bg-navy-900/50 py-20">
        <div className="container-luxe text-center">
          <h2 className="font-display text-3xl font-semibold text-cream sm:text-4xl">
            Need a product not listed here?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/65">
            We also supply cabinets, doors, and more. Tell us what your project needs and we&apos;ll
            source it for you.
          </p>
          <Link href="/contact" className="btn-outline mt-8">
            Talk to our team <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
