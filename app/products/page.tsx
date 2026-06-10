import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import PageHero from "@/components/PageHero";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { PRODUCTS } from "@/lib/data";
import { PRODUCT_IMAGES } from "@/lib/product-images";

export const metadata: Metadata = { title: "Products", description: "SAWANGA complete finishing range." };

export default function ProductsPage() {
  return (
    <>
      <PageHero eyebrow="Our Core Finishing Products" title="A complete range to" highlight="finish right." subtitle="Sourced from trusted brands and stocked for reliable, on-time supply across Kenya." bgImage="/images/granite-stone-staircase.jpg" />
      <section className="pb-24">
        <div className="container-luxe space-y-8">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={(i%2)*80}>
              <div id={p.slug} className="card-luxe scroll-mt-28 overflow-hidden md:flex">
                <div className="relative overflow-hidden md:w-2/5">
                  {PRODUCT_IMAGES[p.slug] ? (
                    <>
                      <Image src={PRODUCT_IMAGES[p.slug]} alt={p.name} width={700} height={500} className="h-56 w-full object-cover md:h-full" />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/30 to-transparent md:bg-gradient-to-r" />
                      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold/20 text-gold backdrop-blur-sm"><Icon name={p.icon} className="h-7 w-7" /></div>
                        <h2 className="mt-3 font-display text-2xl font-semibold text-cream">{p.name}</h2>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full min-h-[14rem] items-center justify-center bg-gradient-to-br from-navy-700 to-navy-900 p-10">
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold"><Icon name={p.icon} className="h-12 w-12" /></div>
                        <h2 className="text-center font-display text-2xl font-semibold text-cream">{p.name}</h2>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-8 md:w-3/5 md:p-10">
                  <p className="text-lg leading-relaxed text-cream/75">{p.detail}</p>
                  <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {p.features.map((f) => (
                      <div key={f} className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-gold"><Check className="h-3.5 w-3.5" /></span>
                        <span className="text-sm text-cream/80">{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={`/quote?product=${encodeURIComponent(p.name)}`} className="btn-gold group mt-8">
                    Request a Quote <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="relative border-t border-gold/15 py-20">
        <Image src="/images/corridor-luxury-water.jpg" alt="" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-navy-900/88" />
        <div className="container-luxe relative text-center">
          <h2 className="font-display text-3xl font-semibold text-cream sm:text-4xl">Need a product not listed here?</h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/70">We also supply cabinets, doors, and more. Tell us what your project needs.</p>
          <Link href="/contact" className="btn-outline mt-8">Talk to our team <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
